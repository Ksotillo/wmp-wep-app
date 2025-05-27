"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
    FiSearch,
    FiPlus,
    FiFolder,
    FiFile,
    FiGrid,
    FiList,
    FiMoreVertical,
    FiHome,
    FiLock,
    FiUsers,
    FiTrash2,
    FiSettings,
    FiBell,
    FiChevronDown,
    FiChevronRight,
    FiCheckSquare,
    FiX,
    FiMoon,
    FiSun,
    FiUser,
    FiLogOut,
    FiUpload,
    FiImage,
    FiShare2,
    FiDownload,
    FiMove,
    FiEye,
    FiCode,
    FiAlertTriangle,
} from "react-icons/fi";
import { RiFileExcelLine, RiDashboardLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { ThemeProvider } from "next-themes";

interface Folder {
    id: string;
    name: string;
    path: string;
    parent: string | null;
    isExpanded?: boolean;
    children?: Folder[];
    files?: File[];
}

interface File {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedByEmail: string;
    dateModified: string;
}

const DocumentDashboard = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [selectedFileType, setSelectedFileType] = useState<string>("all");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [foldersExpanded, setFoldersExpanded] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [folderPath, setFolderPath] = useState("/");
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const itemsPerPage = 5;
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: "All files" }]);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showSharingModal, setShowSharingModal] = useState(false);
    const [sharingEmails, setSharingEmails] = useState("");
    const [filesToShare, setFilesToShare] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [rootFiles, setRootFiles] = useState<File[]>([
        {
            id: "1",
            name: "Dashboard tech requirements",
            type: "docx",
            size: "220 KB",
            uploadedBy: "Amélie",
            uploadedByEmail: "amelie@example.com",
            dateModified: "2024-01-15",
        },
        {
            id: "2",
            name: "Marketing site requirements",
            type: "docx",
            size: "488 KB",
            uploadedBy: "Ammar",
            uploadedByEmail: "ammar@example.com",
            dateModified: "2024-01-14",
        },
        {
            id: "3",
            name: "Q4_2023 Reporting",
            type: "pdf",
            size: "1.2 MB",
            uploadedBy: "Amélie",
            uploadedByEmail: "amelie@example.com",
            dateModified: "2024-01-10",
        },
        {
            id: "4",
            name: "Q3_2023 Reporting",
            type: "pdf",
            size: "1.3 MB",
            uploadedBy: "Sienna",
            uploadedByEmail: "sienna@example.com",
            dateModified: "2023-10-15",
        },
        {
            id: "5",
            name: "Q2_2023 Reporting",
            type: "pdf",
            size: "1.1 MB",
            uploadedBy: "Olly Shi",
            uploadedByEmail: "olly@example.com",
            dateModified: "2023-07-10",
        },
        {
            id: "6",
            name: "Q1_2023 Reporting",
            type: "pdf",
            size: "1.8 MB",
            uploadedBy: "Mathilde",
            uploadedByEmail: "mathilde@example.com",
            dateModified: "2023-04-05",
        },
        {
            id: "7",
            name: "FY_2022-23 Financials",
            type: "xls",
            size: "628 KB",
            uploadedBy: "Sienna",
            uploadedByEmail: "sienna@example.com",
            dateModified: "2023-12-28",
        },
        {
            id: "8",
            name: "FY_2021-22 Financials",
            type: "xls",
            size: "544 KB",
            uploadedBy: "Sienna",
            uploadedByEmail: "sienna@example.com",
            dateModified: "2022-12-30",
        },
    ]);

    const [folderStructure, setFolderStructure] = useState<Folder[]>([
        {
            id: "f1",
            name: "Sophie's files",
            path: "/Sophie's files",
            parent: null,
            isExpanded: false,
            children: [
                {
                    id: "f1-1",
                    name: "Projects",
                    path: "/Sophie's files/Projects",
                    parent: "f1",
                    isExpanded: false,
                    files: [
                        {
                            id: "file-1",
                            name: "Marketing Campaign Draft",
                            type: "docx",
                            size: "352 KB",
                            uploadedBy: "Sophie",
                            uploadedByEmail: "sophie@example.com",
                            dateModified: "2023-12-10",
                        },
                        {
                            id: "file-2",
                            name: "Budget Overview Q4",
                            type: "xls",
                            size: "1.2 MB",
                            uploadedBy: "Sophie",
                            uploadedByEmail: "sophie@example.com",
                            dateModified: "2023-12-15",
                        },
                        {
                            id: "file-3",
                            name: "Campaign Assets",
                            type: "zip",
                            size: "4.7 MB",
                            uploadedBy: "Sophie",
                            uploadedByEmail: "sophie@example.com",
                            dateModified: "2023-12-18",
                        },
                    ],
                },
                {
                    id: "f1-2",
                    name: "Resources",
                    path: "/Sophie's files/Resources",
                    parent: "f1",
                    isExpanded: false,
                    files: [
                        {
                            id: "file-4",
                            name: "Brand Guidelines 2023",
                            type: "pdf",
                            size: "5.8 MB",
                            uploadedBy: "Sophie",
                            uploadedByEmail: "sophie@example.com",
                            dateModified: "2023-11-20",
                        },
                        {
                            id: "file-5",
                            name: "Stock Photos Collection",
                            type: "zip",
                            size: "24.3 MB",
                            uploadedBy: "Sophie",
                            uploadedByEmail: "sophie@example.com",
                            dateModified: "2023-10-05",
                        },
                    ],
                },
            ],
            files: [
                {
                    id: "file-6",
                    name: "Personal Notes",
                    type: "docx",
                    size: "78 KB",
                    uploadedBy: "Sophie",
                    uploadedByEmail: "sophie@example.com",
                    dateModified: "2024-01-03",
                },
                {
                    id: "file-7",
                    name: "Project Timeline",
                    type: "pdf",
                    size: "450 KB",
                    uploadedBy: "Sophie",
                    uploadedByEmail: "sophie@example.com",
                    dateModified: "2023-12-28",
                },
            ],
        },
        {
            id: "f2",
            name: "Dashboard UI",
            path: "/Dashboard UI",
            parent: null,
            isExpanded: false,
            children: [
                {
                    id: "f2-1",
                    name: "Components",
                    path: "/Dashboard UI/Components",
                    parent: "f2",
                    isExpanded: false,
                    files: [
                        {
                            id: "file-8",
                            name: "Button Components",
                            type: "tsx",
                            size: "12.5 KB",
                            uploadedBy: "Ammar",
                            uploadedByEmail: "ammar@example.com",
                            dateModified: "2024-01-15",
                        },
                        {
                            id: "file-9",
                            name: "Card Variants",
                            type: "tsx",
                            size: "18.2 KB",
                            uploadedBy: "Ammar",
                            uploadedByEmail: "ammar@example.com",
                            dateModified: "2024-01-15",
                        },
                        {
                            id: "file-10",
                            name: "Navigation Elements",
                            type: "tsx",
                            size: "22.7 KB",
                            uploadedBy: "Ammar",
                            uploadedByEmail: "ammar@example.com",
                            dateModified: "2024-01-16",
                        },
                    ],
                },
                {
                    id: "f2-2",
                    name: "Layouts",
                    path: "/Dashboard UI/Layouts",
                    parent: "f2",
                    isExpanded: false,
                    files: [
                        {
                            id: "file-11",
                            name: "Dashboard Layout",
                            type: "tsx",
                            size: "8.3 KB",
                            uploadedBy: "Mathilde",
                            uploadedByEmail: "mathilde@example.com",
                            dateModified: "2024-01-12",
                        },
                        {
                            id: "file-12",
                            name: "Analytics Layout",
                            type: "tsx",
                            size: "7.5 KB",
                            uploadedBy: "Mathilde",
                            uploadedByEmail: "mathilde@example.com",
                            dateModified: "2024-01-14",
                        },
                    ],
                },
            ],
            files: [
                {
                    id: "file-13",
                    name: "UI Design System",
                    type: "fig",
                    size: "34.2 MB",
                    uploadedBy: "Mathilde",
                    uploadedByEmail: "mathilde@example.com",
                    dateModified: "2023-12-20",
                },
                {
                    id: "file-14",
                    name: "Component Library Documentation",
                    type: "pdf",
                    size: "2.8 MB",
                    uploadedBy: "Mathilde",
                    uploadedByEmail: "mathilde@example.com",
                    dateModified: "2023-12-22",
                },
            ],
        },
        {
            id: "f3",
            name: "Websites",
            path: "/Websites",
            parent: null,
            isExpanded: false,
            files: [
                {
                    id: "file-15",
                    name: "Company Homepage Redesign",
                    type: "html",
                    size: "86.5 KB",
                    uploadedBy: "Olly Shi",
                    uploadedByEmail: "olly@example.com",
                    dateModified: "2024-01-05",
                },
                {
                    id: "file-16",
                    name: "Landing Page Assets",
                    type: "zip",
                    size: "42.7 MB",
                    uploadedBy: "Olly Shi",
                    uploadedByEmail: "olly@example.com",
                    dateModified: "2024-01-07",
                },
                {
                    id: "file-17",
                    name: "SEO Strategy",
                    type: "docx",
                    size: "165 KB",
                    uploadedBy: "Sienna",
                    uploadedByEmail: "sienna@example.com",
                    dateModified: "2024-01-10",
                },
                {
                    id: "file-18",
                    name: "Analytics Report Dec 2023",
                    type: "pdf",
                    size: "1.45 MB",
                    uploadedBy: "Sienna",
                    uploadedByEmail: "sienna@example.com",
                    dateModified: "2024-01-02",
                },
            ],
        },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const switchTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    const handleFileTypeFilter = (type: string) => {
        if (type === selectedFileType) return;
        setSelectedFileType(type);
        setCurrentPage(1);
    };

    const toggleFolderExpansion = (folderId: string) => {
        setFolderStructure((prevStructure) => {
            return prevStructure.map((folder) => {
                if (folder.id === folderId) {
                    return { ...folder, isExpanded: !folder.isExpanded };
                } else if (folder.children) {
                    const updatedChildren = toggleChildFolder(folder.children, folderId);
                    return { ...folder, children: updatedChildren };
                }
                return folder;
            });
        });
    };

    const toggleChildFolder = (children: Folder[], folderId: string): Folder[] => {
        return children.map((child) => {
            if (child.id === folderId) {
                return { ...child, isExpanded: !child.isExpanded };
            } else if (child.children) {
                return { ...child, children: toggleChildFolder(child.children, folderId) };
            }
            return child;
        });
    };

    const findFolder = (folders: Folder[], id: string): Folder | null => {
        for (const folder of folders) {
            if (folder.id === id) {
                return folder;
            }
            if (folder.children) {
                const found = findFolder(folder.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const getCurrentFolders = (): Folder[] => {
        if (!currentFolder) {
            return folderStructure;
        }

        const folder = findFolder(folderStructure, currentFolder);
        return folder?.children || [];
    };

    const getCurrentFiles = (): File[] => {
        if (!currentFolder) {
            return [];
        }

        const folder = findFolder(folderStructure, currentFolder);
        return folder?.files || [];
    };

    const getCurrentFolderName = (): string => {
        if (!currentFolder) {
            return "All files";
        }

        const folder = findFolder(folderStructure, currentFolder);
        return folder?.name || "All files";
    };

    const navigateToFolder = (folderId: string) => {
        const folder = findFolder(folderStructure, folderId);
        if (folder) {
            setCurrentFolder(folderId);

            const newBreadcrumbs = buildBreadcrumbs(folder);
            setBreadcrumbs(newBreadcrumbs);
        }
    };

    const navigateToRoot = () => {
        setCurrentFolder(null);
        setBreadcrumbs([{ id: null, name: "All files" }]);
    };

    const buildBreadcrumbs = (folder: Folder): { id: string | null; name: string }[] => {
        const result: { id: string | null; name: string }[] = [];

        result.push({ id: null, name: "All files" });

        const buildPath = (currentFolder: Folder, structure: Folder[]): boolean => {
            const topLevelFolder = structure.find((f) => f.id === currentFolder.id);
            if (topLevelFolder) {
                result.push({ id: topLevelFolder.id, name: topLevelFolder.name });
                return true;
            }

            for (const folder of structure) {
                if (folder.children) {
                    const childFolder = folder.children.find((f) => f.id === currentFolder.id);
                    if (childFolder) {
                        result.push({ id: folder.id, name: folder.name });
                        result.push({ id: childFolder.id, name: childFolder.name });
                        return true;
                    }

                    if (folder.children && folder.children.length > 0) {
                        const found = buildPath(currentFolder, folder.children);
                        if (found) {
                            result.splice(1, 0, { id: folder.id, name: folder.name });
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        buildPath(folder, folderStructure);

        return result;
    };

    const getAvailablePaths = (): { id: string; path: string }[] => {
        const basePaths = [{ id: "root", path: "/" }];

        const extractPaths = (folders: Folder[]): { id: string; path: string }[] => {
            let paths: { id: string; path: string }[] = [];

            for (const folder of folders) {
                paths.push({ id: folder.id, path: folder.path });

                if (folder.children && folder.children.length > 0) {
                    paths = [...paths, ...extractPaths(folder.children)];
                }
            }

            return paths;
        };

        return [...basePaths, ...extractPaths(folderStructure)];
    };

    const getParentIdFromPath = (path: string): string | null => {
        const allPaths = getAvailablePaths();
        const parentFolder = allPaths.find((p) => p.path === path);
        return parentFolder ? parentFolder.id : null;
    };

    const addChildFolder = (folders: Folder[], parentPath: string, newFolder: Folder): Folder[] => {
        return folders.map((folder) => {
            if (folder.path === parentPath) {
                return {
                    ...folder,
                    isExpanded: true,
                    children: folder.children ? [...folder.children, newFolder] : [newFolder],
                };
            } else if (folder.children) {
                return {
                    ...folder,
                    children: addChildFolder(folder.children, parentPath, newFolder),
                };
            }
            return folder;
        });
    };

    const createNewFolder = () => {
        if (!newFolderName.trim()) {
            return;
        }

        const newFolderId = `f${Date.now()}`;
        const newPath = folderPath === "/" ? `/${newFolderName}` : `${folderPath}/${newFolderName}`;

        if (folderPath === "/") {
            setFolderStructure([...folderStructure, { id: newFolderId, name: newFolderName, path: newPath, parent: null }]);
        } else {
            const updatedStructure = addChildFolder(folderStructure, folderPath, {
                id: newFolderId,
                name: newFolderName,
                path: newPath,
                parent: getParentIdFromPath(folderPath),
            });

            setFolderStructure(updatedStructure);
        }

        setNewFolderName("");
        setShowFolderModal(false);
    };

    const renderCurrentFolders = () => {
        const folders = getCurrentFolders();

        if (folders.length === 0) {
            return (
                <div className="text-center p-8 text-[var(--text-secondary)]">
                    <p>No folders found in this location</p>
                    <button
                        onClick={() => setShowFolderModal(true)}
                        className="mt-4 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-90 cursor-pointer"
                    >
                        Create New Folder
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {folders.map((folder) => (
                    <div
                        key={folder.id}
                        onClick={() => navigateToFolder(folder.id)}
                        className="bg-[var(--card-bg)] p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--hover-bg)] transition-colors duration-200"
                    >
                        <div className="w-12 h-12 bg-[var(--icon-bg)] rounded-lg flex items-center justify-center mb-3 text-[var(--page-text-primary)]">
                            <FiFolder size={24} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-[var(--page-text-primary)]">{folder.name}</span>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">{folder.files?.length || 0} files</div>
                    </div>
                ))}
                <div
                    onClick={() => setShowFolderModal(true)}
                    className="bg-[var(--card-bg)] p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--hover-bg)] transition-colors duration-200"
                >
                    <div className="w-12 h-12 bg-[var(--icon-bg)] rounded-lg flex items-center justify-center mb-3 text-[var(--page-text-primary)]">
                        <FiPlus size={24} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-[var(--page-text-primary)]">New Folder</span>
                </div>
            </div>
        );
    };

    const renderFolderTree = (folders: Folder[]) => {
        return (
            <ul className="space-y-1">
                {folders.map((folder) => (
                    <li key={folder.id}>
                        <div
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--sidebar-text)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                            onClick={() => navigateToFolder(folder.id)}
                        >
                            {folder.children && folder.children.length > 0 ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFolderExpansion(folder.id);
                                    }}
                                    className="text-[var(--sidebar-text)] hover:text-[var(--page-text-primary)] transition-colors duration-200"
                                >
                                    {folder.isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                                </button>
                            ) : (
                                <div className="w-3.5 h-3.5"></div>
                            )}
                            <FiFolder className="text-[var(--sidebar-text)]" />
                            <span className="text-sm">{folder.name}</span>
                        </div>

                        {folder.children && folder.children.length > 0 && folder.isExpanded && (
                            <div className="pl-4 mt-1">{renderFolderTree(folder.children)}</div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const filterBySearchQuery = (files: File[]): File[] => {
        if (!searchQuery.trim()) return files;

        const query = searchQuery.toLowerCase().trim();
        return files.filter(
            (file) =>
                file.name.toLowerCase().includes(query) ||
                file.type.toLowerCase().includes(query) ||
                file.uploadedBy.toLowerCase().includes(query)
        );
    };

    const filteredFiles = (() => {
        const typeFiltered = currentFolder
            ? selectedFileType === "all"
                ? getCurrentFiles()
                : getCurrentFiles().filter((file) => file.type === selectedFileType)
            : selectedFileType === "all"
            ? rootFiles
            : rootFiles.filter((file) => file.type === selectedFileType);

        return filterBySearchQuery(typeFiltered);
    })();

    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
    const paginatedFiles = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const availablePaths = getAvailablePaths();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const fileName = selectedFile.name;
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
        let fileType = fileExtension;

        const typeMap: { [key: string]: string } = {
            doc: "docx",
            docx: "docx",
            pdf: "pdf",
            xls: "xls",
            xlsx: "xls",
            csv: "xls",
            txt: "txt",
            jpg: "jpg",
            jpeg: "jpg",
            png: "jpg",
            gif: "jpg",
            zip: "zip",
            rar: "zip",
        };

        if (typeMap[fileExtension]) {
            fileType = typeMap[fileExtension];
        }

        let fileSize: string;
        if (selectedFile.size < 1024) {
            fileSize = `${selectedFile.size} B`;
        } else if (selectedFile.size < 1024 * 1024) {
            fileSize = `${Math.round(selectedFile.size / 1024)} KB`;
        } else {
            fileSize = `${Math.round((selectedFile.size / (1024 * 1024)) * 10) / 10} MB`;
        }

        const newFileId = `file-${Date.now()}`;
        const uploadDate = new Date().toISOString().split("T")[0];

        const newFile = {
            id: newFileId,
            name: fileName,
            type: fileType,
            size: fileSize,
            uploadedBy: "Sophie Orwell",
            uploadedByEmail: "sophie@example.com",
            dateModified: uploadDate,
        };

        if (!currentFolder) {
            setRootFiles((prevFiles) => [...prevFiles, newFile]);
        } else {
            setFolderStructure((prevStructure) => {
                const addFileToNestedFolder = (folders: Folder[]): Folder[] => {
                    return folders.map((folder) => {
                        if (folder.id === currentFolder) {
                            return {
                                ...folder,
                                files: folder.files ? [...folder.files, newFile] : [newFile],
                            };
                        } else if (folder.children) {
                            return {
                                ...folder,
                                children: addFileToNestedFolder(folder.children),
                            };
                        }
                        return folder;
                    });
                };

                return addFileToNestedFolder(prevStructure);
            });
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const toggleAllSelection = () => {
        if (paginatedFiles.length === 0) return;

        if (selectedItems.length === paginatedFiles.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedFiles.map((file) => file.id));
        }
    };

    const areAllFilesSelected = paginatedFiles.length > 0 && selectedItems.length === paginatedFiles.length;

    const openFilePreview = (file: File) => {
        setPreviewFile(file);
        setShowPreviewModal(true);
    };

    const openSharingModal = (fileIds: string[] = []) => {
        setFilesToShare(fileIds.length > 0 ? fileIds : selectedItems);
        setSharingEmails("");
        setShowSharingModal(true);
    };

    const openDeleteModal = (fileIds: string[] = []) => {
        setFilesToDelete(fileIds.length > 0 ? fileIds : selectedItems);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        setSelectedItems([]);
        setShowDeleteModal(false);
    };

    const handleShareFiles = () => {
        setShowSharingModal(false);
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <GlobalThemeStyles />
            <div className="flex flex-col min-h-screen bg-[var(--page-bg)]">
                <header className="md:hidden flex justify-between items-center p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-md flex items-center justify-center text-white">
                            <RiDashboardLine size={20} />
                        </div>
                        <span className="font-semibold text-[var(--page-text-primary)]">FileFlow</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={switchTheme}
                            className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] rounded-full cursor-pointer transition-colors duration-200"
                        >
                            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-[var(--avatar-bg)] flex items-center justify-center text-[var(--page-text-primary)]">
                                    <span className="text-xs font-medium">SO</span>
                                </div>
                            </button>

                            {mobileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-[var(--card-bg-alt)] border border-[var(--border-color)] rounded-lg shadow-lg z-10">
                                    <div className="p-3 border-b border-[var(--border-color)]">
                                        <div className="font-medium text-[var(--page-text-primary)]">Sophie Orwell</div>
                                        <div className="text-sm text-[var(--text-secondary)]">sophie@example.com</div>
                                    </div>
                                    <ul className="py-2">
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                            >
                                                <FiUser size={16} />
                                                <span>Profile</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                            >
                                                <FiSettings size={16} />
                                                <span>Settings</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                            >
                                                <FiBell size={16} />
                                                <span>Notifications</span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="border-t border-[var(--border-color)] py-2">
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                        >
                                            <FiLogOut size={16} />
                                            <span>Sign out</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="hidden md:flex md:w-64 flex-shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] h-screen sticky top-0">
                        <div className="p-5 flex items-center gap-2">
                            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-md flex items-center justify-center text-white">
                                <RiDashboardLine size={20} />
                            </div>
                            <span className="font-semibold text-[var(--page-text-primary)]">FileFlow</span>
                        </div>

                        <div className="px-3 py-2 flex-1 overflow-y-auto">
                            <div className="flex justify-between items-center px-3 py-1">
                                <div className="text-xs font-medium uppercase text-[var(--text-secondary)]">File Browser</div>
                                <button
                                    onClick={() => setShowFolderModal(true)}
                                    className="text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer"
                                >
                                    <FiPlus />
                                </button>
                            </div>

                            <div className="mt-2">
                                <button
                                    onClick={() => {
                                        setFoldersExpanded(!foldersExpanded);
                                        if (!foldersExpanded) {
                                            navigateToRoot();
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-[var(--sidebar-text)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                >
                                    {foldersExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                    <span>Folders</span>
                                </button>

                                {foldersExpanded && <div className="pl-2 mt-1">{renderFolderTree(folderStructure)}</div>}
                            </div>
                        </div>

                        <div className="mx-3 mb-4 p-4 bg-[var(--card-bg-alt)] rounded-lg">
                            <div className="text-sm font-medium text-[var(--page-text-primary)]">Storage</div>
                            <div className="mt-2 h-2 bg-[var(--progress-bg)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--accent-primary)] rounded-full" style={{ width: "40%" }}></div>
                            </div>
                            <div className="mt-1 text-xs text-[var(--text-secondary)]">9.2 GB of 10 GB used</div>
                        </div>
                    </aside>

                    <main className="flex-1 overflow-y-auto bg-[var(--page-bg)] h-screen">
                        <div className="max-w-7xl mx-auto p-4 md:p-6">
                            {/* Top Navbar */}
                            <div className="mb-6 p-3 flex justify-end items-center">
                                <div className="hidden md:flex items-center gap-3">
                                    <button
                                        onClick={switchTheme}
                                        className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] rounded-full cursor-pointer transition-colors duration-200"
                                    >
                                        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                                    </button>

                                    <div className="relative">
                                        <button
                                            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[var(--avatar-bg)] flex items-center justify-center text-[var(--page-text-primary)] transition-colors duration-200">
                                                <span className="text-xs font-medium">SO</span>
                                            </div>
                                            <span className="text-sm text-[var(--page-text-primary)] hidden md:block">Sophie Orwell</span>
                                            <FiChevronDown className="text-[var(--text-secondary)]" />
                                        </button>

                                        {mobileMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-[var(--card-bg-alt)] border border-[var(--border-color)] rounded-lg shadow-lg z-10">
                                                <div className="p-3 border-b border-[var(--border-color)]">
                                                    <div className="font-medium text-[var(--page-text-primary)]">Sophie Orwell</div>
                                                    <div className="text-sm text-[var(--text-secondary)]">sophie@example.com</div>
                                                </div>
                                                <ul className="py-2">
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                                        >
                                                            <FiUser size={16} />
                                                            <span>Profile</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                                        >
                                                            <FiSettings size={16} />
                                                            <span>Settings</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                                        >
                                                            <FiBell size={16} />
                                                            <span>Notifications</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                                <div className="border-t border-[var(--border-color)] py-2">
                                                    <a
                                                        href="#"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <FiLogOut size={16} />
                                                        <span>Sign out</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-xl font-semibold text-[var(--page-text-primary)]">{getCurrentFolderName()}</h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleViewMode}
                                        className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] rounded-full cursor-pointer transition-colors duration-200"
                                    >
                                        {viewMode === "grid" ? <FiList /> : <FiGrid />}
                                    </button>
                                    <button className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] rounded-full cursor-pointer transition-colors duration-200">
                                        <FiMoreVertical />
                                    </button>
                                </div>
                            </div>

                            {/* Breadcrumbs Navigation */}
                            <div className="flex items-center mb-6 overflow-x-auto py-2">
                                <div className="flex items-center flex-nowrap">
                                    {breadcrumbs.map((crumb, index) => (
                                        <div key={index} className="flex items-center">
                                            {index > 0 && <FiChevronRight className="mx-2 text-[var(--text-secondary)]" size={14} />}
                                            <button
                                                onClick={() => (crumb.id === null ? navigateToRoot() : navigateToFolder(crumb.id))}
                                                className={`whitespace-nowrap text-sm ${
                                                    index === breadcrumbs.length - 1
                                                        ? "font-medium text-[var(--page-text-primary)]"
                                                        : "text-[var(--text-secondary)] hover:text-[var(--page-text-primary)]"
                                                } transition-colors duration-200`}
                                            >
                                                {crumb.id === null && index === breadcrumbs.length - 1 ? "" : crumb.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Folder Navigation - Replace Quick Actions */}
                            {renderCurrentFolders()}

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-[var(--page-text-primary)]">Files</h2>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 bg-[var(--accent-primary)] text-white rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:opacity-90"
                                            >
                                                <FiPlus size={16} />
                                                <span>New File</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bulk Actions Bar - Appears when files are selected */}
                                {selectedItems.length > 0 && (
                                    <div className="bg-[var(--selected-item-bg)] rounded-md p-3 mb-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[var(--page-text-primary)]">
                                                {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]"
                                                onClick={() => openSharingModal()}
                                            >
                                                <FiShare2 size={16} className="text-[var(--page-text-primary)]" />
                                                <span className="text-[var(--page-text-primary)]">Share</span>
                                            </button>
                                            <button
                                                className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]"
                                                onClick={() => {
                                                    /* Download files logic */
                                                }}
                                            >
                                                <FiDownload size={16} className="text-[var(--page-text-primary)]" />
                                                <span className="text-[var(--page-text-primary)]">Download</span>
                                            </button>
                                            <button
                                                className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]"
                                                onClick={() => {
                                                    /* Move files logic */
                                                }}
                                            >
                                                <FiMove size={16} className="text-[var(--page-text-primary)]" />
                                                <span className="text-[var(--page-text-primary)]">Move</span>
                                            </button>
                                            <button
                                                className="px-3 py-1.5 text-red-500 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-red-100/10"
                                                onClick={() => openDeleteModal()}
                                            >
                                                <FiTrash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                            <button
                                                className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]"
                                                onClick={() => setSelectedItems([])}
                                            >
                                                <FiX size={16} className="text-[var(--page-text-primary)]" />
                                                <span className="text-[var(--page-text-primary)]">Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full px-10 py-2.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--page-text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200"
                                    />
                                    <FiSearch className="absolute left-3 top-3 text-[var(--text-secondary)]" />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setCurrentPage(1);
                                            }}
                                            className="absolute right-3 top-3 text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex overflow-x-auto space-x-2 mb-4 pb-1">
                                    <button
                                        onClick={() => handleFileTypeFilter("all")}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                                            selectedFileType === "all"
                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                        }`}
                                    >
                                        View all
                                    </button>
                                    <button
                                        onClick={() => handleFileTypeFilter("docx")}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                                            selectedFileType === "docx"
                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                        }`}
                                    >
                                        Documents
                                    </button>
                                    <button
                                        onClick={() => handleFileTypeFilter("xls")}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                                            selectedFileType === "xls"
                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                        }`}
                                    >
                                        Spreadsheets
                                    </button>
                                    <button
                                        onClick={() => handleFileTypeFilter("pdf")}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                                            selectedFileType === "pdf"
                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                        }`}
                                    >
                                        PDFs
                                    </button>
                                    <button
                                        onClick={() => handleFileTypeFilter("jpg")}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                                            selectedFileType === "jpg"
                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                        }`}
                                    >
                                        Images
                                    </button>
                                </div>

                                {viewMode === "grid" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                        {paginatedFiles.length === 0 ? (
                                            <div className="col-span-full py-8 text-center text-[var(--text-secondary)]">
                                                <p>No files found matching your criteria</p>
                                            </div>
                                        ) : (
                                            paginatedFiles.map((file) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-[var(--card-bg)] rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:bg-[var(--hover-bg)] transition-all duration-200"
                                                >
                                                    <div className="aspect-video bg-[var(--icon-bg)] flex items-center justify-center relative">
                                                        {file.type === "docx" && <FiFile size={40} className="text-white" />}
                                                        {file.type === "pdf" && <FiFile size={40} className="text-white" />}
                                                        {file.type === "xls" && <RiFileExcelLine size={40} className="text-white" />}
                                                        {file.type === "jpg" && (
                                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                                <FiImage size={40} className="text-white opacity-70" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2 right-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleSelection(file.id);
                                                                }}
                                                                className="w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors duration-200"
                                                            >
                                                                {selectedItems.includes(file.id) ? (
                                                                    <FiCheckSquare size={14} className="text-white" />
                                                                ) : (
                                                                    <FiMoreVertical size={14} className="text-white" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-3">
                                                        <div className="mb-1 text-sm font-medium text-[var(--page-text-primary)] line-clamp-1">
                                                            {file.name}
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-xs text-[var(--text-secondary)]">
                                                                {file.size} • {file.type}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="w-5 h-5 rounded-full bg-[var(--avatar-bg)] flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-[var(--page-text-primary)]">
                                                                        {file.uploadedBy.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {viewMode === "list" && (
                                    <div className="hidden md:flex justify-between items-center mb-2 px-4 py-2 text-sm text-[var(--text-secondary)]">
                                        <div className="w-8">
                                            <input
                                                type="checkbox"
                                                checked={areAllFilesSelected}
                                                onChange={toggleAllSelection}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">File name</div>
                                        <div className="w-1/4 text-right">Uploaded by</div>
                                        <div className="w-24 text-right">Actions</div>
                                    </div>
                                )}

                                {viewMode === "list" && (
                                    <div className="space-y-2">
                                        {paginatedFiles.length === 0 ? (
                                            <div className="py-8 text-center text-[var(--text-secondary)]">
                                                <p>No files found matching your criteria</p>
                                            </div>
                                        ) : (
                                            paginatedFiles.map((file) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-[var(--card-bg)] rounded-lg px-4 py-3 flex items-center cursor-pointer hover:bg-[var(--hover-bg)] transition-colors duration-200"
                                                >
                                                    <div className="w-8">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(file.id)}
                                                            onChange={() => toggleSelection(file.id)}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="text-[var(--page-text-primary)]">
                                                            {file.type === "docx" && <FiFile size={20} />}
                                                            {file.type === "pdf" && <FiFile size={20} />}
                                                            {file.type === "xls" && <RiFileExcelLine size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-[var(--page-text-primary)]">{file.name}</div>
                                                            <div className="text-sm text-[var(--text-secondary)]">
                                                                {file.size} • {file.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-2 w-1/4 justify-end">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--avatar-bg)] flex items-center justify-center">
                                                            <span className="text-xs font-medium text-[var(--page-text-primary)]">
                                                                {file.uploadedBy.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-[var(--page-text-primary)]">{file.uploadedBy}</div>
                                                    </div>
                                                    <div className="ml-4 flex items-center gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openFilePreview(file);
                                                            }}
                                                            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200 rounded-full hover:bg-[var(--hover-bg)]"
                                                        >
                                                            <FiEye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openSharingModal([file.id]);
                                                            }}
                                                            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200 rounded-full hover:bg-[var(--hover-bg)]"
                                                        >
                                                            <FiShare2 size={16} />
                                                        </button>
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveDropdown(activeDropdown === file.id ? null : file.id);
                                                                }}
                                                                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200 rounded-full hover:bg-[var(--hover-bg)]"
                                                            >
                                                                <FiMoreVertical size={16} />
                                                            </button>

                                                            {activeDropdown === file.id && (
                                                                <div className="absolute right-0 mt-1 w-48 bg-[var(--card-bg-alt)] border border-[var(--border-color)] rounded-md shadow-lg z-10">
                                                                    <ul className="py-1">
                                                                        <li>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    openFilePreview(file);
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
                                                                            >
                                                                                View
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();

                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
                                                                            >
                                                                                Download
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    openSharingModal([file.id]);
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
                                                                            >
                                                                                Share
                                                                            </button>
                                                                        </li>
                                                                        <li className="border-t border-[var(--border-color)]">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    openDeleteModal([file.id]);
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--hover-bg)] transition-colors duration-200"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Pagination */}
                                {filteredFiles.length > 0 && (
                                    <div className="flex justify-center items-center mt-6">
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => changePage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 ${
                                                    currentPage === 1
                                                        ? "text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
                                                        : "text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)]"
                                                }`}
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum = 0;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => changePage(pageNum)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                                                            currentPage === pageNum
                                                                ? "bg-[var(--selected-item-bg)] text-[var(--page-text-primary)]"
                                                                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => changePage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 ${
                                                    currentPage === totalPages
                                                        ? "text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
                                                        : "text-[var(--page-text-primary)] hover:bg-[var(--hover-bg)]"
                                                }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="py-4 px-6 border-t border-[var(--border-color)] mt-auto">
                            <div className="max-w-7xl mx-auto flex justify-between items-center">
                                <div className="text-sm text-[var(--text-secondary)]">© 2024 FileFlow. All rights reserved.</div>
                                <div className="flex items-center gap-4">
                                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--page-text-primary)]">
                                        Terms
                                    </a>
                                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--page-text-primary)]">
                                        Privacy
                                    </a>
                                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--page-text-primary)]">
                                        Help
                                    </a>
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>

            {showFolderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg-alt)] rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[var(--page-text-primary)]">Create New Folder</h3>
                            <button
                                onClick={() => setShowFolderModal(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer"
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="folderName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                    Folder Name
                                </label>
                                <input
                                    id="folderName"
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Enter folder name"
                                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--page-text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="folderPath" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                    Location
                                </label>
                                <select
                                    id="folderPath"
                                    value={folderPath}
                                    onChange={(e) => setFolderPath(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                                >
                                    {availablePaths.map((path) => (
                                        <option key={path.id} value={path.path}>
                                            {path.path}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowFolderModal(false)}
                                    className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createNewFolder}
                                    className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-90 cursor-pointer transition-opacity duration-200"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* File Preview Modal */}
            {showPreviewModal && previewFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg-alt)] rounded-lg w-full max-w-4xl h-[80vh] p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[var(--page-text-primary)]">{previewFile.name}</h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto bg-[var(--card-bg)] rounded-md">
                            {previewFile.type === "pdf" && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="text-[var(--text-secondary)] mb-4">
                                        <FiFile size={64} />
                                    </div>
                                    <p className="text-[var(--page-text-primary)] text-lg font-medium mb-2">PDF Preview</p>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                                        Viewing: {previewFile.name} ({previewFile.size})
                                    </p>
                                    <div className="w-full max-w-2xl h-[400px] bg-white rounded-md p-4 overflow-y-auto">
                                        <div className="space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                            <div className="h-8 bg-gray-200 rounded w-full mt-6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(previewFile.type === "docx" || previewFile.type === "txt") && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="text-[var(--text-secondary)] mb-4">
                                        <FiFile size={64} />
                                    </div>
                                    <p className="text-[var(--page-text-primary)] text-lg font-medium mb-2">Document Preview</p>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                                        Viewing: {previewFile.name} ({previewFile.size})
                                    </p>
                                    <div className="w-full max-w-2xl h-[400px] bg-white rounded-md p-4 overflow-y-auto">
                                        <div className="space-y-4 text-gray-800">
                                            <h1 className="text-xl font-bold">Document Title</h1>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                                                tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                                            </p>
                                            <p>
                                                Suspendisse potenti. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,
                                                eget ultricies nisl nisl eget nisl.
                                            </p>
                                            <h2 className="text-lg font-semibold mt-4">Section 1</h2>
                                            <p>
                                                Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl
                                                nisl eget nisl.
                                            </p>
                                            <p>
                                                Suspendisse potenti. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,
                                                eget ultricies nisl nisl eget nisl.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {previewFile.type === "xls" && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="text-[var(--text-secondary)] mb-4">
                                        <RiFileExcelLine size={64} />
                                    </div>
                                    <p className="text-[var(--page-text-primary)] text-lg font-medium mb-2">Spreadsheet Preview</p>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                                        Viewing: {previewFile.name} ({previewFile.size})
                                    </p>
                                    <div className="w-full max-w-2xl h-[400px] bg-white rounded-md overflow-y-auto">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2">#</th>
                                                    <th className="border border-gray-300 px-4 py-2">Column A</th>
                                                    <th className="border border-gray-300 px-4 py-2">Column B</th>
                                                    <th className="border border-gray-300 px-4 py-2">Column C</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...Array(15)].map((_, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{index + 1}</td>
                                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                                            Data {index + 1}A
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                                            Data {index + 1}B
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                                            Data {index + 1}C
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {previewFile.type === "tsx" && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="text-[var(--text-secondary)] mb-4">
                                        <FiCode size={64} />
                                    </div>
                                    <p className="text-[var(--page-text-primary)] text-lg font-medium mb-2">Code Preview</p>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                                        Viewing: {previewFile.name} ({previewFile.size})
                                    </p>
                                    <div className="w-full max-w-2xl h-[400px] bg-[#1e1e1e] rounded-md p-4 overflow-y-auto font-mono text-sm">
                                        <pre className="text-gray-300">
                                            <code>
                                                {`import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        {/* Header content */}
      </header>
      <main>{children}</main>
      <footer className="border-t border-gray-200 dark:border-gray-700">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;`}
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[var(--text-secondary)]">Uploaded by {previewFile.uploadedBy}</span>
                                <span className="text-sm text-[var(--text-secondary)]">•</span>
                                <span className="text-sm text-[var(--text-secondary)]">{previewFile.dateModified}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        openSharingModal([previewFile.id]);
                                    }}
                                    className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 bg-[var(--accent-primary)] text-white hover:opacity-90"
                                >
                                    <FiShare2 size={16} />
                                    <span>Share</span>
                                </button>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="px-3 py-1.5 border border-[var(--border-color)] rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sharing Modal */}
            {showSharingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg-alt)] rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[var(--page-text-primary)]">
                                Share {filesToShare.length > 1 ? `${filesToShare.length} files` : "file"}
                            </h3>
                            <button
                                onClick={() => setShowSharingModal(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--page-text-primary)] cursor-pointer transition-colors duration-200"
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="emails" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                    Email addresses
                                </label>
                                <textarea
                                    id="emails"
                                    value={sharingEmails}
                                    onChange={(e) => setSharingEmails(e.target.value)}
                                    placeholder="Enter email addresses (comma separated)"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--page-text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200"
                                />
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Recipients will receive an email with a link to access these files
                                </p>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                    Message (optional)
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="Add a message"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--page-text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="flex items-center">
                                <input id="notify" type="checkbox" className="h-4 w-4 cursor-pointer" />
                                <label htmlFor="notify" className="ml-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                                    Notify me when files are viewed
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowSharingModal(false)}
                                    className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShareFiles}
                                    className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-90 cursor-pointer transition-opacity duration-200"
                                >
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg-alt)] rounded-lg w-full max-w-md p-6">
                        <div className="flex items-center mb-4 text-red-500">
                            <FiAlertTriangle size={24} className="mr-3" />
                            <h3 className="text-lg font-medium text-[var(--page-text-primary)]">
                                Delete {filesToDelete.length > 1 ? `${filesToDelete.length} files` : "file"}?
                            </h3>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-6">
                            {filesToDelete.length > 1
                                ? `Are you sure you want to delete these ${filesToDelete.length} files? This action cannot be undone.`
                                : "Are you sure you want to delete this file? This action cannot be undone."}
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const GlobalThemeStyles = () => (
    <style jsx global>{`
        :root {
            /* Light Theme Variables */
            --page-bg: #ffffff;
            --sidebar-bg: #f9fafb;
            --card-bg: #f4f4f5;
            --card-bg-alt: #ffffff;
            --selected-item-bg: #f4f4f5;
            --hover-bg: #e4e4e7;
            --icon-bg: #27272a;
            --input-bg: #ffffff;
            --button-bg: #ffffff;
            --progress-bg: #e4e4e7;
            --border-color: #e4e4e7;
            --page-text-primary: #18181b;
            --text-secondary: #71717a;
            --sidebar-text: #52525b;
            --accent-primary: #1e1e1e;
            --avatar-bg: #e4e4e7;
            --font-heading: "Oswald", sans-serif;
            --font-body: "Open Sans", sans-serif;
            --scrollbar-thumb: #d4d4d8;
            --scrollbar-track: #f4f4f5;
        }

        html.dark {
            /* Dark Theme Variable Overrides */
            --page-bg: #18181b;
            --sidebar-bg: #27272a;
            --card-bg: #27272a;
            --card-bg-alt: #2d2d2d;
            --selected-item-bg: #3f3f46;
            --hover-bg: #3f3f46;
            --icon-bg: #52525b;
            --input-bg: #27272a;
            --button-bg: #27272a;
            --progress-bg: #3f3f46;
            --border-color: #3f3f46;
            --page-text-primary: #f4f4f5;
            --text-secondary: #a1a1aa;
            --sidebar-text: #d4d4d8;
            --accent-primary: #1e1e1e;
            --avatar-bg: #52525b;
            --scrollbar-thumb: #52525b;
            --scrollbar-track: #27272a;
        }

        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: var(--font-heading);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--text-secondary);
        }

        /* Import fonts */
        @import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap");
    `}</style>
);

const Page = () => {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <DocumentDashboard />
        </ThemeProvider>
    );
};

export default Page;
