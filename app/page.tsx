"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

import {
    UserCircle,
    Menu,
    X,
    FileText,
    PlusCircle,
    Search,
    MessageSquare,
    ChevronDown,
    MessageCircle as LucideMessageCircle,
    Activity as LucideActivity,
    FileEdit as LucideFileEdit,
    Send,
    Save,
    Trash2,
    Bold,
    Italic,
    Eye,
    Code as CodeIcon,
    List,
    ListOrdered,
    Link2,
    Code2 as CodeBlockIcon,
    Settings,
    LogOut,
    Edit3,
    Quote,
    CloudUpload,
    History as HistoryIcon
} from "lucide-react";

interface Comment {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    isAnnotation?: boolean;
    contextText?: string;
    documentId?: string;
}

interface Document {
    id: string;
    title: string;
    content: string;
    lastModified?: number;
}

interface ActivityLog {
    id: string;
    timestamp: Date;
    action: string; 
    documentTitle?: string; 
    details?: string; 
}


const documentTemplates= [
    {
        id: "blank",
        name: "Blank Document",
        content: `### Untitled\n\nStart with a clean slate.`,
    },
    {
        id: "meeting-notes",
        name: "Meeting Notes",
        
        content: `### Meeting Notes\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:**\n- Person A\n- Person B\n\n**Agenda:**\n1. Point 1\n2. Point 2\n\n**Discussion:**\n\n\n**Action Items:**\n- Action 1 (Owner, Due Date)\n`,
    },
    {
        id: "project-brief",
        name: "Project Brief",
        content: `### Project Brief: [Project Name]\n\n**1. Project Goal:**\n   - \n\n**2. Target Audience:**\n   - \n\n**3. Key Deliverables:**\n   - \n\n**4. Timeline:**\n   - \n\n**5. Budget (Optional):**\n   - `,
    },
];

const initialSampleDocuments: Document[] = [
    {
        id: "doc-1",
        title: "Project Proposal.docx",
        content: `### Project Proposal: CollaboraDocs\n\nThis document outlines the proposal for the CollaboraDocs platform...`,
        lastModified: Date.now() - 100000,
    },
    {
        id: "doc-2",
        title: "Q3 Marketing Report.pdf",
        content: `### Q3 Marketing Performance\n\nDetailed analysis of marketing campaigns and results for the third quarter.`,
        lastModified: Date.now() - 200000,
    },
    {
        id: "doc-3",
        title: "Meeting Notes - July 15.txt",
        content: `#### Attendees\n- Alice\n- Bob\n\n#### Discussion Points\n- Reviewed Q2 results...`,
        lastModified: Date.now(),
    },
];

const defaultInitialDocContent = documentTemplates[0].content; 

const CollaboraDocsInitialPage = () => {
    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [commentsList, setCommentsList] = useState([]);

    const [documents, setDocuments] = useState([]);
    const [activeDocumentId, setActiveDocumentId] = useState(null);
    const [documentText, setDocumentText] = useState("");
    const [sidebarSearchTerm, setSidebarSearchTerm] = useState("");
    const [saveStatus, setSaveStatus] = useState("");
    const [editorMode, setEditorMode] = useState("");
    const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
    const [newDocumentTitle, setNewDocumentTitle] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [activityLogs, setActivityLogs] = useState([]);
    const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);
    const [currentUserName, setCurrentUserName] = useState("Demo User");
    const [selectedDocumentText, setSelectedDocumentText] = useState("");
    const textAreaRef = useRef(null);
    const userProfileRef = useRef(null);

    const activeHeadingFont = "'Oswald', sans-serif";
    const activeBodyFont = "'Open Sans', sans-serif";
    useEffect(() => {
        try {
            const storedDocsString = localStorage.getItem("collaboradocs-documents");
            let loadedDocuments = initialSampleDocuments;
            if (storedDocsString) {
                const storedDocsMeta = JSON.parse(storedDocsString);
                if (storedDocsMeta.length > 0) {
                    loadedDocuments = storedDocsMeta.map((metaDoc) => {
                        const storedContent = localStorage.getItem(`collaboradocs-doc-content-${metaDoc.id}`);
                        return {
                            ...metaDoc,
                            content:
                                storedContent ||
                                initialSampleDocuments.find((sd) => sd.id === metaDoc.id)?.content ||
                                defaultInitialDocContent,
                        };
                    });
                } else {
                    loadedDocuments = [];
                }
            }
            setDocuments(loadedDocuments);

            if (loadedDocuments.length > 0) {
                const lastActiveId = localStorage.getItem("collaboradocs-lastActiveDocId");
                const docExists = loadedDocuments.find((d) => d.id === lastActiveId);
                setActiveDocumentId(docExists ? lastActiveId : loadedDocuments[0].id);
            } else {
                setActiveDocumentId(null);
            }
        } catch (error) {
            console.error("Failed to load documents from localStorage:", error);
            setDocuments(initialSampleDocuments);
            if (initialSampleDocuments.length > 0) setActiveDocumentId(initialSampleDocuments[0].id);
        }
    }, []);

    useEffect(() => {
        if (activeDocumentId) {
            const currentDoc = documents.find((doc) => doc.id === activeDocumentId);
            if (currentDoc) {
                setDocumentText(currentDoc.content);
                setCommentsList([]);
                localStorage.setItem("collaboradocs-lastActiveDocId", activeDocumentId);
                setEditorMode("edit");
            } else {
                if (documents.length > 0) {
                    setActiveDocumentId(documents[0].id);
                } else {
                    setActiveDocumentId(null);
                    setDocumentText(defaultInitialDocContent); 
                    setEditorMode("edit");
                }
            }
        } else {
            setDocumentText(defaultInitialDocContent);
            setCommentsList([]);
            localStorage.removeItem("collaboradocs-lastActiveDocId");
            setEditorMode("edit");
        }
    }, [activeDocumentId, documents]);

    useEffect(() => {
        if (documents.length > 0 || localStorage.getItem("collaboradocs-documents")) {
            const docsToStore = documents.map(({ id, title, lastModified }) => ({ id, title, lastModified }));
            localStorage.setItem("collaboradocs-documents", JSON.stringify(docsToStore));
        } else if (documents.length === 0 && !localStorage.getItem("collaboradocs-documents")) {
        } else {
            localStorage.setItem("collaboradocs-documents", JSON.stringify([]));
        }
    }, [documents]);

    const addActivityLog = useCallback((action, documentTitle, details) => {
        const newLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date(),
            action,
            documentTitle,
            details,
        };
        setActivityLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50)); 
    }, []);


    const toggleLeftSidebar = () => setIsLeftSidebarVisible(!isLeftSidebarVisible);

    const triggerMockFeatureAlert = (actionName: string) => alert(`${actionName} activated! This is a placeholder.`);

    const updateEditorContent = (newContent: string) => setDocumentText(newContent);

    const persistCurrentDocument = useCallback(() => {
        if (activeDocumentId) {
            const currentDoc = documents.find((doc) => doc.id === activeDocumentId);
            if (currentDoc) {
                const updatedDoc = { ...currentDoc, content: documentText, lastModified: Date.now() };
                setDocuments((docs) => docs.map((d) => (d.id === activeDocumentId ? updatedDoc : d)));
                localStorage.setItem(`collaboradocs-doc-content-${activeDocumentId}`, documentText);
                setSaveStatus("Saved!");
                addActivityLog("Document Saved", updatedDoc.title);
                setTimeout(() => setSaveStatus(""), 2000);
            } else {
                setSaveStatus("Error: Document not found.");
            }
        } else {
            setSaveStatus("No active document to save.");
        }
    }, [activeDocumentId, documentText, documents, addActivityLog]);
    const processCommentSubmission = () => {
        if (!newCommentText.trim()) return;
        
        const tempAnnotationContext = localStorage.getItem('tempAnnotationContext');
        let actualCommentText = newCommentText.trim();
        let isAnnot = false;
        let contextTxt = undefined;

        if (tempAnnotationContext) {
            
            
            
            const quotedContextLines = tempAnnotationContext.split('\n').map(line => `> ${line}`).join('\n');
            if (actualCommentText.startsWith(quotedContextLines)) {
                isAnnot = true;
                contextTxt = tempAnnotationContext; 
                
                actualCommentText = actualCommentText.substring(quotedContextLines.length).trim();
            }
            localStorage.removeItem('tempAnnotationContext'); 
        }

        const newComment = {
            id: Date.now(),
            user: currentUserName,
            text: actualCommentText, 
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isAnnotation: isAnnot,
            contextText: contextTxt,
            documentId: activeDocumentId || undefined, 
        };

        
        if (!newComment.text && isAnnot) {
            alert("Please add your comment after the quoted text.");
            
            
            return;
        }

        setCommentsList([newComment, ...commentsList]);
        setNewCommentText("");
        const currentDoc = documents.find(doc => doc.id === activeDocumentId);
        if (currentDoc) {
            addActivityLog(
                isAnnot ? "Annotation Added" : "Comment Added", 
                currentDoc.title, 
                isAnnot ? `Context: "${contextTxt?.substring(0,30)}..." Comment: "${actualCommentText.substring(0,20)}..."` 
                        : `Comment: "${actualCommentText.substring(0,30)}..."`
            );
        }
    };

    const alterUserProfileName = () => {
        const newName = prompt("Enter new user name:", currentUserName);
        if (newName && newName.trim() !== "") {
            setCurrentUserName(newName.trim());
            addActivityLog(`User name changed to "${newName.trim()}"`);
        }
        setIsUserProfileDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userProfileRef.current && !userProfileRef.current.contains(event.target as Node)) {
                setIsUserProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openCreateDocumentModal = () => {
        setNewDocumentTitle("");
        setSelectedTemplateId(documentTemplates[0].id);
        setIsCreateDocModalOpen(true);
    };

    const closeCreateDocumentModal = () => {
        setIsCreateDocModalOpen(false);
        setNewDocumentTitle("");
    };

    const confirmCreateNewDocument = () => {
        const title = newDocumentTitle.trim();
        if (title === "") {
            alert("Document title cannot be empty.");
            return;
        }

        const selectedTemplate = documentTemplates.find((t) => t.id === selectedTemplateId) || documentTemplates[0];
        let content = selectedTemplate.content;
        content = content.replace(/\[Project Name\]/g, title);
        content = content.replace(/### Untitled/g, `### ${title}`);
        content = content.replace(/\$\{new Date\(\)\.toLocaleDateString\(\)\}/g, new Date().toLocaleDateString());

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            title: title,
            content: content,
            lastModified: Date.now(),
        };
        setDocuments((prevDocs) => [newDoc, ...prevDocs]);
        setActiveDocumentId(newDoc.id);
        setActiveMainTab("document");
        localStorage.setItem(`collaboradocs-doc-content-${newDoc.id}`, newDoc.content);
        addActivityLog("Document Created", newDoc.title, `From template: ${selectedTemplate.name}`);

        closeCreateDocumentModal();

        if (isLeftSidebarVisible && window.innerWidth < 1024) {
            toggleLeftSidebar();
        }
    };

    const loadDocumentIntoView = (docId: string) => {
        setActiveDocumentId(docId);
        setActiveMainTab("document");
        if (isLeftSidebarVisible && window.innerWidth < 1024) {
            toggleLeftSidebar();
        }
    };

    const removeDocumentFromList = (docIdToDelete: string) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            const docToDelete = documents.find(doc => doc.id === docIdToDelete);
            setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docIdToDelete));
            localStorage.removeItem(`collaboradocs-doc-content-${docIdToDelete}`);
            if (docToDelete) {
                addActivityLog("Document Deleted", docToDelete.title);
            }
        }
    };

    const filteredDocuments = documents
        .filter((doc) => doc.title.toLowerCase().includes(sidebarSearchTerm.toLowerCase()))
        .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

    const activeDocument = documents.find((doc) => doc.id === activeDocumentId);

    
    const convertMarkdownToHtml = (markdown: string): string => {
        if (!markdown) return "<p><br></p>";
        let html = markdown;

        
        html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
        html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
        html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
        html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
        html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
        html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

        
        html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
        html = html.replace(/__(.*?)__/gim, "<strong>$1</strong>");

        
        html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
        html = html.replace(/_(.*?)_/gim, "<em>$1</em>");

        
        html = html.replace(/^\s*[-*+] (.*)/gim, "<li>$1</li>");
        html = html.replace(/(<li>.*<\/li>\s*)+/gim, (match) => `<ul>${match.replace(/\s*<li>/g, "<li>")}</ul>`);

        
        const paragraphs = html.split(/\n\s*\n/);
        html = paragraphs
            .map((p) => {
                if (p.startsWith("<ul>") || p.startsWith("<h")) return p;
                return `<p>${p.replace(/\n/g, "<br />")}</p>`;
            })
            .join("");

        return html;
    };

    const applyMarkdownFormatting = (syntax: "bold" | "italic" | "ul" | "ol" | "link") => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = documentText.substring(start, end);
        let prefix = "";
        let suffix = "";
        let textToInsert = selectedText;

        switch (syntax) {
            case "bold":
                prefix = "**";
                suffix = "**";
                break;
            case "italic":
                prefix = "*";
                suffix = "*";
                break;
            case "ul":
                if (selectedText.includes("\n")) {
                    textToInsert = selectedText
                        .split("\n")
                        .map((line) => `- ${line}`)
                        .join("\n");
                } else {
                    prefix = "- ";
                }
                break;
            case "ol":
                if (selectedText.includes("\n")) {
                    let count = 1;
                    textToInsert = selectedText
                        .split("\n")
                        .map((line) => `${count++}. ${line}`)
                        .join("\n");
                } else {
                    prefix = "1. ";
                }
                break;
            case "link":
                const url = prompt("Enter URL:");
                if (!url) return;
                prefix = "[";
                suffix = `](${url})`;
                if (!selectedText) textToInsert = "link text";
                break;
        }

        const newText = documentText.substring(0, start) + prefix + textToInsert + suffix + documentText.substring(end);

        updateEditorContent(newText);

        textarea.focus();
        if (selectedText || syntax === "link") {
            if (syntax === "link" && !selectedText) {
                textarea.setSelectionRange(start + prefix.length, start + prefix.length + "link text".length);
            } else {
                textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToInsert.length);
            }
        } else {
            textarea.setSelectionRange(start + prefix.length, start + prefix.length);
        }
    };

    const captureHighlightedText = () => {
        const textarea = textAreaRef.current;
        if (textarea) {
            const text = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
            if (text.trim() !== "") {
                setSelectedDocumentText(text.trim());
            } else {
                
                
                setSelectedDocumentText(""); 
            }
        }
    };

    const initiateCommentOnSelection = () => {
        if (!selectedDocumentText) return;
        setActiveMainTab('comments');
        
        const quotedText = selectedDocumentText.split('\n').map(line => `> ${line}`).join('\n');
        setNewCommentText(`${quotedText}\n\n`); 
        setSelectedDocumentText(""); 
        
        
        localStorage.setItem('tempAnnotationContext', selectedDocumentText);
    };

    return (
        <>
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Open+Sans:wght@400;600;700&display=swap");

                :root {
                    --color-primary-dark: #2b3230;
                    --color-primary-light: #f3f5f4;
                    --color-muted-gray: #949c9b;
                    --color-accent-green: #31ab62;
                    --color-light-border: #e5e7eb;
                    --color-dark-border: #374151;
                    --color-text-on-dark: #f3f5f4;
                    --color-text-on-light: #2b3230;
                }

                body {
                    font-family: ${activeBodyFont};
                    background-color: var(--color-primary-light);
                    color: var(--color-text-on-light);
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                .dark body {
                    background-color: var(--color-primary-dark);
                    color: var(--color-text-on-dark);
                }

                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    font-family: ${activeHeadingFont};
                    color: inherit;
                }

                .prose {
                    color: var(--color-text-on-light);
                }
                .dark .prose {
                    color: var(--color-text-on-dark);
                }
                .prose h1,
                .prose h2,
                .prose h3,
                .prose h4,
                .prose h5,
                .prose h6 {
                    color: inherit;
                }
                .prose a {
                    color: var(--color-accent-green);
                    text-decoration: none;
                }
                .prose a:hover {
                    text-decoration: underline;
                }
                .prose strong {
                    color: inherit;
                }
                .prose blockquote {
                    border-left-color: var(--color-accent-green);
                    color: inherit;
                }

                html,
                body,
                #__next,
                .min-h-screen {
                    height: 100%;
                }

                /* Main page background - distinct from panels */
                .page-background {
                    background-color: var(--color-primary-light);
                }
                .dark .page-background {
                    background-color: var(--color-primary-dark);
                }

                /* Subtle scrollbar for editor & sidebars */
                .editor-textarea::-webkit-scrollbar,
                .sidebar-scrollable::-webkit-scrollbar {
                    width: 8px;
                }
                .editor-textarea::-webkit-scrollbar-track,
                .sidebar-scrollable::-webkit-scrollbar-track {
                    background: transparent;
                }
                .editor-textarea::-webkit-scrollbar-thumb,
                .sidebar-scrollable::-webkit-scrollbar-thumb {
                    background: var(--color-muted-gray);
                    border-radius: 4px;
                }
                .editor-textarea::-webkit-scrollbar-thumb:hover,
                .sidebar-scrollable::-webkit-scrollbar-thumb:hover {
                    background: var(--color-accent-green);
                }
            `}</style>

            <div className="min-h-screen flex flex-col page-background text-[var(--color-text-on-light)] dark:text-[var(--color-text-on-dark)]">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900 backdrop-blur-md  border-b border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                    <div className="  px-4 sm:px-6 py-3 flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <button
                                className="lg:hidden mr-3 p-1.5 rounded-md hover:bg-[var(--color-light-border)]/40 dark:hover:bg-[var(--color-muted-gray)]/40 cursor-pointer"
                                onClick={toggleLeftSidebar}
                            >
                                {isLeftSidebarVisible ? <X size={22} /> : <Menu size={22} />}
                            </button>
                            <h1 className="text-2xl font-medium tracking-tight" style={{ fontFamily: activeHeadingFont }}>
                                NexusDocs
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative" ref={userProfileRef}>
                                <UserCircle
                                    size={28}
                                    className="text-[var(--color-muted-gray)] dark:text-[var(--color-light-border)] cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen)}
                                />
                                {isUserProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                                            <p className="text-sm font-medium truncate">{currentUserName}</p>
                                            <p className="text-xs text-[var(--color-muted-gray)] truncate">
                                                {currentUserName.toLowerCase().replace(/\s+/g, '.')}@example.com
                                            </p>
                                        </div>
                                        <button
                                            onClick={alterUserProfileName}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-[var(--color-light-border)]/70 dark:hover:bg-[var(--color-muted-gray)]/40 transition-colors cursor-pointer"
                                        >
                                            <Edit3 size={14} className="mr-2 text-[var(--color-muted-gray)]" /> Change Name
                                        </button>
                                        <button
                                            onClick={() => { triggerMockFeatureAlert('Settings clicked'); setIsUserProfileDropdownOpen(false); }}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-[var(--color-light-border)]/70 dark:hover:bg-[var(--color-muted-gray)]/40 transition-colors cursor-pointer"
                                        >
                                            <Settings size={14} className="mr-2 text-[var(--color-muted-gray)]" /> Settings
                                        </button>
                                        <div className="my-1 h-px bg-[var(--color-light-border)] dark:bg-[var(--color-dark-border)]"></div>
                                        <button
                                            onClick={() => { triggerMockFeatureAlert('Logout clicked'); setIsUserProfileDropdownOpen(false); }}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 transition-colors cursor-pointer"
                                        >
                                            <LogOut size={14} className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside
                        className={`fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex pt-16 lg:pt-0 ${
                            isLeftSidebarVisible ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"
                        }`}
                    >
                        <div className="p-4 flex-grow flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold" style={{ fontFamily: activeHeadingFont }}>
                                    Documents
                                </h2>
                            </div>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-muted-gray)]" />
                                    <input
                                        type="search"
                                        placeholder="Search docs..."
                                        value={sidebarSearchTerm}
                                        onChange={(e) => setSidebarSearchTerm(e.target.value)}
                                        className="pl-10 pr-3 py-1.5 w-full text-sm rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-primary-dark)]/50 focus:ring-1 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] outline-none placeholder-[var(--color-muted-gray)]"
                                    />
                                </div>
                            </div>
                            <nav className="space-y-1 flex-grow overflow-y-auto sidebar-scrollable pr-1">
                                {filteredDocuments.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            loadDocumentIntoView(doc.id);
                                        }}
                                        className={`group flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-150 ease-in-out
                      ${
                          activeDocumentId === doc.id
                              ? "bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)] font-medium"
                              : "hover:bg-[var(--color-light-border)]/70 dark:hover:bg-[var(--color-muted-gray)]/40"
                      }
                    `}
                                    >
                                        <div className="flex items-center truncate">
                                            <FileText
                                                size={18}
                                                className={`mr-3 flex-shrink-0 transition-colors duration-150 ease-in-out 
                            ${
                                activeDocumentId === doc.id
                                    ? "text-[var(--color-accent-green)]"
                                    : "text-[var(--color-muted-gray)] group-hover:text-[var(--color-accent-green)]"
                            }`}
                                            />
                                            <span className="truncate" title={doc.title}>
                                                {doc.title}
                                            </span>
                                        </div>
                                        <Trash2
                                            size={16}
                                            className="text-[var(--color-muted-gray)] group-hover:text-red-500 dark:group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDocumentFromList(doc.id);
                                            }}
                                        />
                                    </a>
                                ))}
                                {filteredDocuments.length === 0 && documents.length > 0 && (
                                    <p className="px-3 py-2 text-sm text-[var(--color-muted-gray)] italic">
                                        No documents match your search.
                                    </p>
                                )}
                                {documents.length === 0 && (
                                    <p className="px-3 py-2 text-sm text-[var(--color-muted-gray)] italic">No documents yet. Create one!</p>
                                )}
                            </nav>
                            <div className="my-4 pt-4 border-t border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                                <h3 className="px-1 text-xs font-semibold uppercase text-[var(--color-muted-gray)] tracking-wider mb-2" style={{ fontFamily: activeHeadingFont }}>
                                    Cloud Storage
                                </h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => alert("Connect to Google Drive")}
                                        className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-[var(--color-light-border)]/70 dark:hover:bg-[var(--color-muted-gray)]/40 text-left transition-colors cursor-pointer"
                                    >
                                        <CloudUpload size={16} className="mr-2.5 text-[var(--color-muted-gray)]" /> Connect to Google Drive
                                    </button>
                                    <button
                                        onClick={() => alert("Link File from Dropbox")}
                                        className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-[var(--color-light-border)]/70 dark:hover:bg-[var(--color-muted-gray)]/40 text-left transition-colors cursor-pointer"
                                    >
                                        <CloudUpload size={16} className="mr-2.5 text-[var(--color-muted-gray)]" /> Link File from Dropbox
                                    </button>
                                </div>
                            </div>
                            <button
                                className="mt-auto w-full flex items-center justify-center px-4 py-2 bg-[var(--color-accent-green)] text-[var(--color-text-on-dark)] text-sm font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                                onClick={openCreateDocumentModal}
                            >
                                <PlusCircle size={18} className="mr-2" /> New Document
                            </button>
                        </div>
                        <div className="p-3 border-t border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                            <button
                                className="w-full flex items-center text-sm text-[var(--color-muted-gray)] hover:text-[var(--color-text-on-light)] dark:hover:text-[var(--color-text-on-dark)] p-2 rounded-md hover:bg-[var(--color-light-border)]/50 dark:hover:bg-[var(--color-muted-gray)]/20 cursor-pointer transition-colors"
                                onClick={() => setActiveMainTab("comments")}
                            >
                                <MessageSquare size={16} className="mr-2" /> Post a comment...
                            </button>
                        </div>
                    </aside>

                    {isLeftSidebarVisible && (
                        <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm lg:hidden" onClick={toggleLeftSidebar}></div>
                    )}

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
                        <div className="mb-4 text-sm">
                            <span
                                className="text-[var(--color-muted-gray)] hover:underline cursor-pointer"
                                onClick={() => triggerMockFeatureAlert("Navigate to All Documents")}
                            >
                                All Documents
                            </span>
                            <span className="text-[var(--color-muted-gray)] mx-1">/</span>
                            <span
                                className="font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                                title={activeDocument ? activeDocument.title : "Untitled Document"}
                            >
                                {activeDocument ? activeDocument.title : "Untitled Document"}
                            </span>
                        </div>

                        <h2
                            className="text-2xl sm:text-3xl font-semibold mb-4 truncate"
                            style={{ fontFamily: activeHeadingFont }}
                            title={activeDocument ? activeDocument.title : "Untitled Document"}
                        >
                            {activeDocument ? activeDocument.title : "Untitled Document"}
                        </h2>

                        <div className="mb-5 border-b border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                            <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
                                {["document", "comments", "activity", "history"].map((tabKey) => {
                                    let TabIconComponent = LucideFileEdit;
                                    if (tabKey === "comments") TabIconComponent = LucideMessageCircle;
                                    if (tabKey === "activity") TabIconComponent = LucideActivity;
                                    if (tabKey === "history") TabIconComponent = HistoryIcon;
                                    const tabLabel = tabKey.charAt(0).toUpperCase() + tabKey.slice(1);

                                    return (
                                        <button
                                            key={tabKey}
                                            onClick={() => setActiveMainTab(tabKey)}
                                            className={`group inline-flex items-center whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors duration-150 ease-in-out
                        ${
                            activeMainTab === tabKey
                                ? "border-[var(--color-accent-green)] text-[var(--color-accent-green)]"
                                : "border-transparent text-[var(--color-muted-gray)] hover:text-[var(--color-text-on-light)] dark:hover:text-[var(--color-text-on-dark)] hover:border-[var(--color-muted-gray)]/70"
                        }
                      `}
                                        >
                                            <TabIconComponent
                                                size={16}
                                                className={`mr-2 ${
                                                    activeMainTab === tabKey
                                                        ? "text-[var(--color-accent-green)]"
                                                        : "text-[var(--color-muted-gray)] group-hover:text-[var(--color-text-on-light)] dark:group-hover:text-[var(--color-text-on-dark)]"
                                                } transition-colors duration-150 ease-in-out`}
                                            />
                                            <span className={`${activeMainTab === tabKey ? '' : 'hidden sm:inline-block'}`}>
                                                {tabLabel}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="flex-grow flex flex-col">
                            {activeMainTab === "document" && (
                                <div className="flex flex-col flex-grow bg-white dark:bg-gray-900/50 rounded-lg shadow-sm overflow-hidden h-full">
                                    <div className="flex items-center justify-between p-2 border-b border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
                                        <div className="flex items-center space-x-1">
                                            {editorMode === "edit" && (
                                                <>
                                                    <button
                                                        title="Bold"
                                                        onClick={() => applyMarkdownFormatting("bold")}
                                                        className="p-1.5 rounded hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50 cursor-pointer"
                                                    >
                                                        <Bold size={16} />
                                                    </button>
                                                    <button
                                                        title="Italic"
                                                        onClick={() => applyMarkdownFormatting("italic")}
                                                        className="p-1.5 rounded hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50 cursor-pointer"
                                                    >
                                                        <Italic size={16} />
                                                    </button>
                                                    <button
                                                        title="Unordered List"
                                                        onClick={() => applyMarkdownFormatting("ul")}
                                                        className="p-1.5 rounded hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50 cursor-pointer"
                                                    >
                                                        <List size={16} />
                                                    </button>
                                                    <button
                                                        title="Ordered List"
                                                        onClick={() => applyMarkdownFormatting("ol")}
                                                        className="p-1.5 rounded hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50 cursor-pointer"
                                                    >
                                                        <ListOrdered size={16} />
                                                    </button>
                                                    <button
                                                        title="Insert Link"
                                                        onClick={() => applyMarkdownFormatting("link")}
                                                        className="p-1.5 rounded hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50 cursor-pointer"
                                                    >
                                                        <Link2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {editorMode === "preview" && (
                                                <div className="w-[calc(6*1.5rem+6*16px+5*0.25rem)] min-w-[150px]"></div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => setEditorMode("edit")}
                                                disabled={editorMode === "edit" || !activeDocument}
                                                className={`p-1.5 rounded flex items-center text-xs font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                                                    editorMode === "edit"
                                                        ? "bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]"
                                                        : "hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50"
                                                }`}
                                            >
                                                <CodeIcon size={14} className="mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setEditorMode("preview")}
                                                disabled={editorMode === "preview" || !activeDocument}
                                                className={`p-1.5 rounded flex items-center text-xs font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                                                    editorMode === "preview"
                                                        ? "bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]"
                                                        : "hover:bg-[var(--color-light-border)] dark:hover:bg-[var(--color-muted-gray)]/50"
                                                }`}
                                            >
                                                <Eye size={14} className="mr-1" /> Preview
                                            </button>
                                        </div>

                                        <div className="flex items-center">
                                            {saveStatus && (
                                                <span className="text-xs text-[var(--color-accent-green)] mr-3 transition-opacity duration-500">
                                                    {saveStatus}
                                                </span>
                                            )}
                                            <button
                                                onClick={persistCurrentDocument}
                                                disabled={!activeDocument}
                                                className="flex items-center px-3 py-1 bg-[var(--color-accent-green)] text-[var(--color-text-on-dark)] text-xs font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Save size={14} className="mr-1.5" /> Save
                                            </button>
                                        </div>
                                    </div>

                                    {editorMode === "edit" && (
                                        <textarea
                                            ref={textAreaRef}
                                            value={documentText}
                                            onChange={(e) => updateEditorContent(e.target.value)}
                                            onMouseUp={captureHighlightedText}
                                            onTouchEnd={captureHighlightedText}
                                            placeholder="Start typing your document... (Supports basic Markdown)"
                                            className="w-full flex-1 p-3 sm:p-4 text-sm border-none focus:ring-0 bg-transparent dark:bg-transparent outline-none resize-none placeholder-[var(--color-muted-gray)] leading-relaxed editor-textarea min-h-0"
                                            disabled={!activeDocument}
                                        />
                                    )}
                                    {editorMode === "preview" && activeDocument && (
                                        <div
                                            className="prose prose-sm sm:prose-base dark:prose-invert max-w-full w-full flex-1 p-3 sm:p-4 overflow-y-auto editor-textarea min-h-0"
                                            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(documentText) }}
                                        />
                                    )}
                                    {!activeDocument && editorMode === "preview" && (
                                        <div className="p-3 sm:p-4 text-sm text-[var(--color-muted-gray)] italic flex-1 min-h-0">
                                            No document selected to preview.
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeMainTab === "comments" && (
                                <div className="p-4 sm:p-6 bg-white dark:bg-[var(--color-primary-dark)]/40 rounded-lg shadow-sm flex flex-col h-full">
                                    <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: activeHeadingFont }}>
                                        Comments
                                    </h3>
                                    <div className="mb-6">
                                        <textarea
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="w-full p-3 text-sm rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)]/70 focus:ring-2 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] outline-none resize-none placeholder-[var(--color-muted-gray)] min-h-[80px]"
                                            rows={3}
                                        ></textarea>
                                        <button
                                            onClick={processCommentSubmission}
                                            className="mt-2 flex items-center justify-center px-4 py-2 bg-[var(--color-accent-green)] text-[var(--color-text-on-dark)] text-sm font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!newCommentText.trim()}
                                        >
                                            <Send size={16} className="mr-2" /> Post Comment
                                        </button>
                                    </div>
                                    <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                                        {commentsList.length === 0 && (
                                            <p className="text-[var(--color-muted-gray)] text-sm italic">
                                                No comments yet. Be the first to comment!
                                            </p>
                                        )}
                                        {commentsList.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="p-3 rounded-md border border-[var(--color-light-border)]/50 dark:border-[var(--color-muted-gray)]/30 bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)]/60 shadow-sm"
                                            >
                                                <div className="flex items-center mb-1.5">
                                                    <UserCircle size={20} className="mr-2 text-[var(--color-muted-gray)] flex-shrink-0" />
                                                    <span className="font-medium text-sm truncate" title={comment.user}>
                                                        {comment.user}
                                                    </span>
                                                    <span className="text-xs text-[var(--color-muted-gray)] ml-auto flex-shrink-0">
                                                        {comment.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-sm pl-[calc(20px+0.5rem)] leading-relaxed whitespace-pre-wrap break-words">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeMainTab === "activity" && (
                                <div className="p-4 sm:p-6 bg-white dark:bg-[var(--color-primary-dark)]/40 rounded-lg shadow-sm flex-1 overflow-y-auto">
                                    <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: activeHeadingFont }}>
                                        Activity Log
                                    </h3>
                                    {activityLogs.length === 0 ? (
                                        <p className="text-[var(--color-muted-gray)] italic">
                                            No activity yet. Try creating, saving, or commenting on a document.
                                        </p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {activityLogs.map((log) => {
                                                let Icon = LucideActivity; 
                                                if (log.action.includes("Created")) Icon = PlusCircle;
                                                if (log.action.includes("Saved")) Icon = Save;
                                                if (log.action.includes("Deleted")) Icon = Trash2;
                                                if (log.action.includes("Comment")) Icon = LucideMessageCircle;

                                                return (
                                                    <li key={log.id} className="flex items-start space-x-3 pb-3 border-b border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/20 last:border-b-0">
                                                        <Icon size={18} className="mt-1 text-[var(--color-accent-green)] flex-shrink-0" />
                                                        <div className="flex-grow">
                                                            <p className="text-sm font-medium">
                                                                {log.action}
                                                                {log.documentTitle && <span className="font-normal text-[var(--color-muted-gray)]"> on "{log.documentTitle}"</span>}
                                                            </p>
                                                            {log.details && (
                                                                <p className="text-xs text-[var(--color-muted-gray)] mt-0.5">
                                                                    {log.details}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-[var(--color-muted-gray)]/80 mt-0.5">
                                                                {log.timestamp.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}
                            {activeMainTab === "history" && (
                                <div className="p-4 sm:p-6 bg-white dark:bg-[var(--color-primary-dark)]/40 rounded-lg shadow-sm flex-1 overflow-y-auto">
                                    <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: activeHeadingFont }}>
                                        Document Revisions
                                    </h3>
                                    {!activeDocument ? (
                                        <p className="text-[var(--color-muted-gray)] italic">
                                            Open a document to see its revision history.
                                        </p>
                                    ) : (
                                        <ul className="space-y-5">
                                            {[
                                                { id: "rev-3", timestamp: "July 26, 2024, 02:15 PM", user: "Alice Bertman", changes: "Updated project scope and added new milestones." },
                                                { id: "rev-2", timestamp: "July 26, 2024, 10:30 AM", user: currentUserName, changes: "Minor typo fixes and section reordering." },
                                                { id: "rev-1", timestamp: "July 25, 2024, 05:00 PM", user: "Bob Siwoo", changes: "Initial draft creation." },
                                            ].map((revision, index) => (
                                                <li key={revision.id} className="pb-4 border-b border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/20 last:border-b-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="text-md font-medium" style={{ fontFamily: activeHeadingFont }}>
                                                            Revision - {revision.timestamp} {index === 0 && <span className="text-xs font-normal px-1.5 py-0.5 ml-2 rounded-full bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]">Latest</span>}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-[var(--color-muted-gray)] mb-1.5">
                                                        Saved by: <span className="font-medium text-[var(--color-text-on-light)] dark:text-[var(--color-text-on-dark)]">{revision.user}</span>
                                                    </p>
                                                    <p className="text-sm mb-2.5 italic text-[var(--color-muted-gray)]">
                                                        "{revision.changes}"
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => alert(`Previewing revision ${revision.id} - For demonstration purposes only.`)}
                                                            className="px-3 py-1 text-xs font-medium rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)] hover:bg-[var(--color-light-border)]/50 dark:hover:bg-[var(--color-muted-gray)]/30 cursor-pointer transition-colors"
                                                        >
                                                            Preview Revision
                                                        </button>
                                                        <button
                                                            onClick={() => alert(`Reverting to revision ${revision.id} - For demonstration purposes only. This action is not functional.`)}
                                                            className="px-3 py-1 text-xs font-medium rounded-md border border-[var(--color-accent-green)]/70 text-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)]/10 cursor-pointer transition-colors"
                                                        >
                                                            Revert to this Revision
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {activeDocument && documents.find(d => d.id === activeDocumentId) && [].length === 0 && ( 
                                        <p className="text-[var(--color-muted-gray)] italic">
                                            No revision history available for this document yet.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>

                    <aside className="hidden xl:flex flex-col w-72 bg-white dark:bg-gray-900 border-l border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/50 p-4 sm:p-6 overflow-y-auto sidebar-scrollable">
                        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: activeHeadingFont }}>
                            Annotations
                        </h3>

                        {selectedDocumentText ? (
                            <div className="mb-4 p-3 border border-[var(--color-accent-green)]/50 rounded-md bg-[var(--color-accent-green)]/10">
                                <p className="text-xs text-[var(--color-muted-gray)] mb-1 font-medium">Selected Text:</p>
                                <blockquote className="border-l-2 border-[var(--color-accent-green)] pl-2 text-sm italic text-[var(--color-text-on-light)] dark:text-[var(--color-text-on-dark)] max-h-32 overflow-y-auto whitespace-pre-wrap break-words">
                                    {selectedDocumentText}
                                </blockquote>
                                <button
                                    onClick={initiateCommentOnSelection}
                                    className="mt-3 w-full flex items-center justify-center text-xs px-3 py-1.5 bg-[var(--color-accent-green)] text-[var(--color-text-on-dark)] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    <LucideMessageCircle size={14} className="mr-1.5" /> Comment on Selection
                                </button>
                            </div>
                        ) : (
                            <div className="p-3 border border-dashed border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/50 rounded-md text-center">
                                <Quote size={24} className="mx-auto text-[var(--color-muted-gray)] mb-2" />
                                <p className="text-sm text-[var(--color-muted-gray)]">
                                    Select text in the document to add an annotation or contextual comment.
                                </p>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/30 flex-grow overflow-y-auto space-y-3 pr-1 sidebar-scrollable">
                            {commentsList
                                .filter((comment) => comment.isAnnotation && comment.documentId === activeDocumentId)
                                .map((annotation) => (
                                    <div
                                        key={annotation.id}
                                        className="p-2.5 rounded-md bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)]/70 border border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/40 shadow-sm"
                                    >
                                        {annotation.contextText && (
                                            <blockquote className="mb-1.5 border-l-2 border-[var(--color-accent-green)] pl-2 text-xs italic text-[var(--color-muted-gray)] dark:text-[var(--color-light-border)]/70 max-h-20 overflow-y-auto whitespace-pre-wrap break-words">
                                                {annotation.contextText}
                                            </blockquote>
                                        )}
                                        <div className="flex items-start space-x-2">
                                            <UserCircle size={18} className="mt-0.5 text-[var(--color-muted-gray)] flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center justify-between text-xs mb-0.5">
                                                    <span className="font-medium text-text-on-light dark:text-text-on-dark">
                                                        {annotation.user}
                                                    </span>
                                                    <span className="text-[var(--color-muted-gray)]/80">{annotation.timestamp}</span>
                                                </div>
                                                <p className="text-sm text-text-on-light dark:text-text-on-dark whitespace-pre-wrap break-words">
                                                    {annotation.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {commentsList.filter((comment) => comment.isAnnotation && comment.documentId === activeDocumentId).length ===
                                0 && (
                                <p className="text-xs text-center text-[var(--color-muted-gray)] italic py-4">
                                    No annotations for this document yet.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>

                <footer className="py-4 px-4 sm:px-6 text-center border-t border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)]/50 bg-white dark:bg-gray-900">
                    <p className="text-xs text-[var(--color-muted-gray)]">
                        &copy; {new Date().getFullYear()} NexusDocs. All rights reserved.
                    </p>
                </footer>

                {isCreateDocModalOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
                        onClick={closeCreateDocumentModal}
                    >
                        <div
                            className="bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold" style={{ fontFamily: activeHeadingFont }}>
                                    Create New Document
                                </h3>
                                <button
                                    onClick={closeCreateDocumentModal}
                                    className="p-1 rounded-md hover:bg-[var(--color-light-border)]/50 dark:hover:bg-[var(--color-muted-gray)]/30 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="docTemplate" className="block text-sm font-medium mb-1">
                                    Select Template
                                </label>
                                <select
                                    id="docTemplate"
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    className="w-full p-2.5 text-sm rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)] bg-white dark:bg-[var(--color-primary-dark)]/50 focus:ring-1 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] outline-none placeholder-[var(--color-muted-gray)] cursor-pointer"
                                >
                                    {documentTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="newDocTitle" className="block text-sm font-medium mb-1">
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    id="newDocTitle"
                                    value={newDocumentTitle}
                                    onChange={(e) => setNewDocumentTitle(e.target.value)}
                                    placeholder="Enter document title..."
                                    className="w-full p-2.5 text-sm rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)] bg-white dark:bg-[var(--color-primary-dark)]/50 focus:ring-1 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)] outline-none placeholder-[var(--color-muted-gray)]"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && confirmCreateNewDocument()}
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={closeCreateDocumentModal}
                                    className="px-4 py-2 text-sm rounded-md border border-[var(--color-light-border)] dark:border-[var(--color-muted-gray)] hover:bg-[var(--color-light-border)]/50 dark:hover:bg-[var(--color-muted-gray)]/30 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCreateNewDocument}
                                    disabled={!newDocumentTitle.trim()}
                                    className="px-4 py-2 bg-[var(--color-accent-green)] text-[var(--color-text-on-dark)] text-sm font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Document
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CollaboraDocsInitialPage;
