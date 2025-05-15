"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { motion } from "framer-motion";
import { ArrowRight, Check, Code, Globe, Shield, Server, Cpu, Zap, Key, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Montserrat, Open_Sans } from "next/font/google";

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const openSans = Open_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestAnchor = target.closest('a');
      
      if (closestAnchor && closestAnchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = closestAnchor.getAttribute('href');
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    cubeRenderTarget.texture.type = THREE.HalfFloatType;
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);

    
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    
    const cubes: THREE.Mesh[] = [];
    
    
    const cubePositions = [
      
      { position: { x: 0, y: 2.5, z: 0 } },
      
      { position: { x: 0, y: -2.5, z: 0 } },
      
      { position: { x: 0, y: 0, z: 2.5 } },
      
      { position: { x: 0, y: 0, z: -2.5 } },
      
      { position: { x: 2.5, y: 0, z: 0 } },
      
      { position: { x: -2.5, y: 0, z: 0 } },
    ];

    
    const createMetallicMaterials = () => {
      const colors = [
        "#b86ef9", 
        "#8a43ff", 
        "#6d28d9", 
        "#a16ef9", 
        "#d8b4fe", 
        "#a855f7", 
      ];
      
      return colors.map(color => {
        return new THREE.MeshPhysicalMaterial({ 
          color: new THREE.Color(color),
          metalness: 0.8,
          roughness: 0.2,
          reflectivity: 1.0,
          clearcoat: 0.6,
          clearcoatRoughness: 0.2,
          envMap: cubeRenderTarget.texture,
        });
      });
    };

    
    const createCube = (positionData: { position: { x: number; y: number; z: number } }, index: number) => {
      
      const size = 1.5 + (index % 3) * 0.1;
      const radius = 0.25; 
      const segments = 3; 
      
      
      const geometry = new RoundedBoxGeometry(size, size, size, segments, radius);
      
      
      const materials = createMetallicMaterials();
      const material = materials[index % materials.length];
      
      
      const cube = new THREE.Mesh(geometry, material);
      
      
      cube.position.set(
        positionData.position.x,
        positionData.position.y,
        positionData.position.z
      );
      
      
      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;
      cube.rotation.z = Math.random() * Math.PI;
      
      
      cubeGroup.add(cube);
      cubes.push(cube);
      
      
      (cube as any).rotationSpeed = {
        x: 0.004 + Math.random() * 0.005,
        y: 0.004 + Math.random() * 0.005,
        z: 0.004 + Math.random() * 0.005
      };
      
      return cube;
    };

    
    cubePositions.forEach((position, index) => {
      createCube(position, index);
    });

    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1.5, 20);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00ffff, 1.5, 20);
    pointLight2.position.set(5, -5, -5);
    scene.add(pointLight2);

    
    const movingLight = new THREE.PointLight(0xffd700, 1.5, 20);
    scene.add(movingLight);

    
    camera.position.z = 10;
    
    
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      
      const width = parent.clientWidth;
      
      
      const isMobile = window.innerWidth < 768;
      const height = isMobile ? Math.min(360, width * 0.8) : parent.clientHeight || width * 0.75;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    
    handleResize();

    
    const animate = () => {
      requestAnimationFrame(animate);

      
      cubeGroup.visible = false;
      cubeCamera.update(renderer, scene);
      cubeGroup.visible = true;

      
      cubeGroup.rotation.x += 0.002;
      cubeGroup.rotation.y += 0.003;

      
      const time = Date.now() * 0.001;
      movingLight.position.x = Math.sin(time * 0.5) * 6;
      movingLight.position.y = Math.cos(time * 0.3) * 4;
      movingLight.position.z = Math.sin(time * 0.2) * 6;

      
      cubes.forEach((cube) => {
        const speed = (cube as any).rotationSpeed;
        cube.rotation.x += speed.x;
        cube.rotation.y += speed.y;
        cube.rotation.z += speed.z;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      
      
      cubes.forEach(cube => {
        cubeGroup.remove(cube);
        cube.geometry.dispose();
        if (Array.isArray(cube.material)) {
          cube.material.forEach((material: THREE.Material) => material.dispose());
        } else {
          cube.material.dispose();
        }
      });
      
      scene.remove(cubeGroup);
      renderer.dispose();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
      <main
          className={`min-h-screen text-white overflow-hidden relative ${openSans.className}`}
          style={{
              backgroundImage: "linear-gradient(to top right, #d2b9f7 0%,#845ae8 15%, #3e2480 33%, #06060b 45%)",
          }}
      >
          
          <div
              className="absolute -top-20 -left-20 w-[80vw] h-[60vw] rounded-full opacity-60 mix-blend-screen pointer-events-none"
              style={{
                  background: "rgb(61, 41, 138)",
                  filter: "blur(72px)",
                  opacity: 0.8,
                  height: "20vw",
              }}
          />

          
          <div
              className="absolute top-[120px] -left-10 w-[20vw] rounded-full opacity-60 mix-blend-screen pointer-events-none"
              style={{
                  background: "rgb(61, 41, 138)",
                  filter: "blur(85px)",
                  opacity: 1,
                  height: "10vw",
              }}
          />
          
          
          <div
              className="absolute top-[85vh] -right-[30vw] w-[60vw] h-[40vh] rounded-full opacity-30 mix-blend-screen pointer-events-none"
              style={{
                  background: "rgb(146, 83, 255)",
                  filter: "blur(120px)",
              }}
          />
          
          
          <div
              className="absolute top-[100vh] -right-[20vw] w-[40vw] h-[30vh] rounded-full opacity-20 mix-blend-screen pointer-events-none"
              style={{
                  background: "rgb(72, 41, 138)",
                  filter: "blur(100px)",
              }}
          />

          
          <nav className="flex justify-between items-center py-4 px-8 md:px-16 lg:px-24 relative z-10">
              <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                  <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M4 6C5.5 6 6.5 9 8 9C9.5 9 10.5 6 12 6C13.5 6 14.5 9 16 9C17.5 9 18.5 6 20 6V18C18.5 18 17.5 15 16 15C14.5 15 13.5 18 12 18C10.5 18 9.5 15 8 15C6.5 15 5.5 18 4 18V6Z"
                              fill="#352672"
                          />
                      </svg>
                  </div>
              </motion.div>

              <div className={`hidden md:flex space-x-12 text-sm font-normal font-bold ${montserrat.className}`}>
                  {[
                      { name: "Home", href: "#" },
                      { name: "Solutions", href: "#solutions" },
                      { name: "Pricing", href: "#pricing" },
                      { name: "Resources", href: "#resources" }
                  ].map((item, index) => (
                      <motion.a 
                          key={item.name}
                          href={item.href} 
                          className="hover:text-purple-300 transition-colors relative" 
                          whileHover={{ y: -2 }}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                              duration: 0.5, 
                              delay: 0.1 + index * 0.1,
                              ease: [0.6, -0.05, 0.01, 0.99]
                          }}
                      >
                          {item.name}
                          <motion.span
                              className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400"
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.2 }}
                          />
                      </motion.a>
                  ))}
              </div>

              <div className={`flex space-x-4 ${montserrat.className} text-sm font-normal font-bold`}>
                  <motion.button
                      className="px-4 py-2 rounded-md hover:text-purple-300 transition-colors cursor-pointer"
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                  >
                      Login
                  </motion.button>
                  <motion.button
                      className="px-4 py-2 bg-[#181a1e] border border-white/30 text-white rounded-full hover:bg-opacity-90 transition-colors cursor-pointer"
                      whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 8px rgba(168, 85, 247, 0.5)",
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                  >
                      Sign up
                  </motion.button>
              </div>
          </nav>

          
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 md:px-16 lg:px-24 pt-12 pb-24">
              <div className="w-full lg:w-1/2 z-10 mt-12 lg:mt-0">
                  
                  <motion.div
                      className="flex mb-6 items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                  >
                      <div className="bg-white/10 backdrop-blur-sm rounded-full pl-1 pr-4 md:pr-6 py-1 flex items-center">
                          <span className="bg-white text-purple-900 rounded-full text-xs font-bold px-2 py-0.5 mr-2">New</span>
                          <span className="text-xs md:text-sm">Introducing our new most advanced Web3 hosting</span>
                      </div>
                  </motion.div>

                  
                  <motion.h1
                      className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${montserrat.className}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                  >
                      Build on
                      <br />
                      decentralized
                      <br />
                      crypto protocol
                  </motion.h1>

                  
                  <motion.p
                      className="text-lg mb-10 text-purple-100 dark:text-purple-200 max-w-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                  >
                      Nebula Core is a leading provider of cutting-edge decentralized solutions, powering the next generation of NFT,
                      GameFi, and Metaverse projects.
                  </motion.p>

                  
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-white text-purple-900 pl-6 pr-4 py-3 rounded-full font-medium cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                  >
                      <span>Schedule demo</span>
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center ml-2">
                          <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                  </motion.button>
              </div>

              <motion.div
                  className="w-full lg:w-1/2 flex justify-center relative z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
              >
                  <canvas ref={canvasRef} className="w-full max-w-lg h-[360px] md:h-[400px] lg:h-auto" />
              </motion.div>
          </div>

          
          <section id="solutions" className="py-20 overflow-hidden">
              <div className="container mx-auto px-8 md:px-16 lg:px-24">
                  <div className="text-center mb-16">
                      <motion.h2 
                          className={`text-4xl md:text-5xl font-bold mb-4 ${montserrat.className}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                      >
                          Blockchain Solutions
                      </motion.h2>
                      <motion.p 
                          className="text-xl text-purple-200 max-w-3xl mx-auto"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                      >
                          Explore our comprehensive suite of decentralized services designed to scale with your blockchain project
                      </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                          {
                              icon: <Code className="w-7 h-7" />,
                              title: "Smart Contract Development",
                              description: "Custom smart contracts designed for security, efficiency, and interoperability across multiple blockchains."
                          },
                          {
                              icon: <Shield className="w-7 h-7" />,
                              title: "Security Auditing",
                              description: "Comprehensive audit services to identify vulnerabilities before they become exploits."
                          },
                          {
                              icon: <Globe className="w-7 h-7" />,
                              title: "dApp Development",
                              description: "End-to-end development of decentralized applications with intuitive user interfaces."
                          },
                          {
                              icon: <Server className="w-7 h-7" />,
                              title: "Web3 Infrastructure",
                              description: "Robust infrastructure services for Web3 project hosting, scaling, and maintenance."
                          },
                          {
                              icon: <Cpu className="w-7 h-7" />,
                              title: "Layer 2 Solutions",
                              description: "Scalability solutions to enhance transaction throughput and reduce gas costs."
                          },
                          {
                              icon: <Zap className="w-7 h-7" />,
                              title: "Blockchain Integration",
                              description: "Seamless integration of blockchain technology with your existing systems and processes."
                          }
                      ].map((solution, index) => (
                          <motion.div 
                              key={index}
                              className="bg-black/20 backdrop-blur-lg rounded-2xl border border-purple-800/30 p-6 hover:border-purple-500/50 transition-all"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 * index }}
                              whileHover={{ y: -5, boxShadow: "0 10px 20px -10px rgba(168, 85, 247, 0.3)" }}
                          >
                              <div className="bg-purple-700/30 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                  {solution.icon}
                              </div>
                              <h3 className={`text-xl font-semibold mb-3 ${montserrat.className}`}>{solution.title}</h3>
                              <p className="text-purple-200/80">{solution.description}</p>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>

          
          <section id="pricing" className="py-20 overflow-hidden">
              <div className="container mx-auto px-8 md:px-16 lg:px-24">
                  <div className="text-center mb-16">
                      <motion.h2 
                          className={`text-4xl md:text-5xl font-bold mb-4 ${montserrat.className}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                      >
                          Transparent Pricing
                      </motion.h2>
                      <motion.p 
                          className="text-xl text-purple-200 max-w-3xl mx-auto"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                      >
                          Choose the plan that works best for your blockchain project's needs and scale
                      </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                      {[
                          {
                              title: "Starter",
                              price: "$1,499",
                              period: "per month",
                              description: "Perfect for startups exploring blockchain solutions",
                              features: [
                                  "Smart contract deployment",
                                  "Basic security audit",
                                  "5 TB Web3 storage",
                                  "Developer support (8/5)",
                                  "API access"
                              ],
                              featured: false,
                              cta: "Get Started"
                          },
                          {
                              title: "Professional",
                              price: "$3,999",
                              period: "per month",
                              description: "Ideal for growing projects with advanced requirements",
                              features: [
                                  "Custom smart contract development",
                                  "Comprehensive security audit",
                                  "20 TB Web3 storage",
                                  "Priority support (24/7)",
                                  "Advanced analytics dashboard",
                                  "Cross-chain compatibility",
                                  "Custom API integration"
                              ],
                              featured: true,
                              cta: "Choose Pro"
                          },
                          {
                              title: "Enterprise",
                              price: "Custom",
                              period: "tailored solution",
                              description: "For established organizations with complex needs",
                              features: [
                                  "Full-suite blockchain solutions",
                                  "Enterprise-grade security",
                                  "Unlimited Web3 storage",
                                  "Dedicated account manager",
                                  "Custom feature development",
                                  "White label options",
                                  "SLA guarantee"
                              ],
                              featured: false,
                              cta: "Contact Us"
                          }
                      ].map((plan, index) => (
                          <motion.div 
                              key={index}
                              className={`rounded-2xl p-8 ${plan.featured 
                                  ? 'bg-gradient-to-b from-purple-800/40 to-purple-900/40 border-2 border-purple-500/50 relative z-10 scale-105 shadow-xl' 
                                  : 'bg-black/20 backdrop-blur-lg border border-purple-800/30'}`}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.2 * index }}
                          >
                              {plan.featured && (
                                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-sm font-bold py-1 px-4 rounded-full">
                                      Most Popular
                                  </div>
                              )}
                              <h3 className={`text-2xl font-bold mb-2 ${montserrat.className}`}>{plan.title}</h3>
                              <div className="flex items-end mb-6">
                                  <span className={`text-4xl font-bold ${montserrat.className}`}>{plan.price}</span>
                                  <span className="text-purple-300 ml-2 pb-1">{plan.period}</span>
                              </div>
                              <p className="text-purple-200/80 mb-6">{plan.description}</p>
                              
                              <div className="space-y-3 mb-8">
                                  {plan.features.map((feature, i) => (
                                      <div key={i} className="flex items-start">
                                          <Check className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                                          <span className="text-sm text-purple-100">{feature}</span>
                                      </div>
                                  ))}
                              </div>
                              
                              <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`w-full py-3 rounded-full font-medium cursor-pointer ${
                                      plan.featured 
                                          ? 'bg-white text-purple-900'
                                          : 'bg-purple-900/50 hover:bg-purple-800/70 text-white border border-purple-700/50'
                                  }`}
                              >
                                  {plan.cta}
                              </motion.button>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>

          
          <section id="resources" className="py-20 overflow-hidden">
              <div className="container mx-auto px-8 md:px-16 lg:px-24">
                  <div className="text-center mb-16">
                      <motion.h2 
                          className={`text-4xl md:text-5xl font-bold mb-4 ${montserrat.className}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                      >
                          Resources Hub
                      </motion.h2>
                      <motion.p 
                          className="text-xl text-purple-200 max-w-3xl mx-auto"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                      >
                          Educational materials and tools to help you succeed in the Web3 ecosystem
                      </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                          {
                              title: "Blockchain Fundamentals Guide",
                              category: "EDUCATION",
                              image: "https://images.unsplash.com/photo-1666816943145-bac390ca866c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "Learn the core concepts of blockchain technology and cryptocurrencies."
                          },
                          {
                              title: "Smart Contract Security Best Practices",
                              category: "SECURITY",
                              image: "https://plus.unsplash.com/premium_photo-1663931932637-e30332303b71?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "Essential security tips to protect your smart contracts from vulnerabilities."
                          },
                          {
                              title: "Web3 Developer Toolkit",
                              category: "DEVELOPMENT",
                              image: "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "A comprehensive collection of tools for Web3 developers."
                          },
                          {
                              title: "NFT Creation Masterclass",
                              category: "TUTORIAL",
                              image: "https://images.unsplash.com/photo-1667036679091-6da384768075?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "Step-by-step guide to creating and launching your own NFT collection."
                          },
                          {
                              title: "Crypto Market Analysis",
                              category: "RESEARCH",
                              image: "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "In-depth analysis of cryptocurrency market trends and opportunities."
                          },
                          {
                              title: "DeFi Protocols Comparison",
                              category: "ANALYSIS",
                              image: "https://images.unsplash.com/photo-1641391503184-a2131018701b?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                              description: "Detailed comparison of popular DeFi protocols and their features."
                          }
                      ].map((resource, index) => (
                          <motion.div 
                              key={index}
                              className="rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm border border-purple-800/20 hover:border-purple-500/30 transition-all"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 * index }}
                              whileHover={{ y: -5, boxShadow: "0 10px 20px -10px rgba(168, 85, 247, 0.2)" }}
                          >
                              <div 
                                  className="h-40 w-full relative"
                              >
                                  <img 
                                      src={resource.image} 
                                      alt={resource.title}
                                      className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-purple-900/50 mix-blend-multiply" />
                              </div>
                              <div className="p-6">
                                  <div className="text-xs font-bold text-purple-400 mb-2">{resource.category}</div>
                                  <h3 className={`text-xl font-semibold mb-3 ${montserrat.className}`}>{resource.title}</h3>
                                  <p className="text-purple-200/80 mb-4">{resource.description}</p>
                                  <motion.button
                                      whileHover={{ x: 5 }}
                                      className="flex items-center text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                                  >
                                      Learn more
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                  </motion.button>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>

          
          <footer className="border-t border-purple-800/30 pt-20 pb-10 overflow-hidden bg-[#06060b] relative z-10">
              <div className="container mx-auto px-8 md:px-16 lg:px-24">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                      
                      <div className="col-span-1 lg:col-span-1">
                          <div className="flex items-center mb-6">
                              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                          d="M4 6C5.5 6 6.5 9 8 9C9.5 9 10.5 6 12 6C13.5 6 14.5 9 16 9C17.5 9 18.5 6 20 6V18C18.5 18 17.5 15 16 15C14.5 15 13.5 18 12 18C10.5 18 9.5 15 8 15C6.5 15 5.5 18 4 18V6Z"
                                          fill="#352672"
                                      />
                                  </svg>
                              </div>
                              <h3 className={`text-xl font-bold ml-3 ${montserrat.className}`}>Nebula Core</h3>
                          </div>
                          <p className="text-purple-200/70 mb-6">
                              Pioneering the future of decentralized technology with secure, scalable blockchain solutions.
                          </p>
                          <div className="flex space-x-4">
                              <a href="#" className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center hover:bg-purple-800/50 transition-colors cursor-pointer">
                                  <Twitter className="w-5 h-5 text-purple-300" />
                              </a>
                              <a href="#" className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center hover:bg-purple-800/50 transition-colors cursor-pointer">
                                  <Github className="w-5 h-5 text-purple-300" />
                              </a>
                              <a href="#" className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center hover:bg-purple-800/50 transition-colors cursor-pointer">
                                  <Linkedin className="w-5 h-5 text-purple-300" />
                              </a>
                          </div>
                      </div>
                      
                      
                      <div>
                          <h4 className={`text-lg font-semibold mb-6 ${montserrat.className}`}>Company</h4>
                          <ul className="space-y-4">
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">About Us</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Careers</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Partners</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Blog</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Press Kit</a></li>
                          </ul>
                      </div>
                      
                      
                      <div>
                          <h4 className={`text-lg font-semibold mb-6 ${montserrat.className}`}>Solutions</h4>
                          <ul className="space-y-4">
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">NFT Marketplaces</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">GameFi Platforms</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">DeFi Applications</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Identity Solutions</a></li>
                              <li><a href="#" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">Enterprise Blockchain</a></li>
                          </ul>
                      </div>
                      
                      
                      <div>
                          <h4 className={`text-lg font-semibold mb-6 ${montserrat.className}`}>Contact</h4>
                          <ul className="space-y-4">
                              <li className="flex items-center">
                                  <Mail className="w-5 h-5 text-purple-400 mr-3" />
                                  <a href="mailto:contact@nebulacore.io" className="text-purple-200/70 hover:text-white transition-colors cursor-pointer">contact@nebulacore.io</a>
                              </li>
                              <li className="text-purple-200/70 mt-6">
                                  <p className="mb-2">Join our newsletter:</p>
                                  <div className="flex mt-2">
                                      <input 
                                          type="email" 
                                          placeholder="Your email" 
                                          className="bg-purple-900/20 border border-purple-700/30 rounded-l-md px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                                      />
                                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r-md cursor-pointer">
                                          Subscribe
                                      </button>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
                  
                  <div className="border-t border-purple-800/30 pt-8 mt-8 text-center text-purple-200/50 text-sm">
                      <p>© {new Date().getFullYear()} Nebula Core. All rights reserved.</p>
                  </div>
              </div>
          </footer>
      </main>
  );
}
