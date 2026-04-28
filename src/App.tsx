import { motion, AnimatePresence } from 'motion/react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Mail, 
  Globe, 
  MapPin, 
  ChevronRight,
  BookOpen,
  Briefcase,
  Award,
  Download,
  GraduationCap,
  ExternalLink,
  MessageSquare,
  FileText,
  Upload,
  Printer,
  X,
  Search,
  ArrowRight,
  Camera,
  Check,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Expand
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CV_DATA } from './constants';

import { 
  TriaxialSchematic, 
  MicroCTVisual, 
  NanoporeSchematic, 
  FlowSchematic, 
  CarbonSchematic,
  PetrophysicsVisual
} from './components/ResearchVisuals';

const sectionFadeIn = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function App() {
  const { personal, researchInterests, experience, education, publications, awards, memberships, reviewing, skills } = CV_DATA as any;
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [headerImgs, setHeaderImgs] = useState<string[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvExternalUrl, setCvExternalUrl] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [tempImg, setTempImg] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [croppingType, setCroppingType] = useState<'profile' | 'header'>('profile');
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true') {
      setIsOwner(true);
    }
    const savedProfile = localStorage.getItem('abinash_profile_image');
    if (savedProfile) setProfileImg(savedProfile);

    const savedHeaders = localStorage.getItem('abinash_header_images');
    if (savedHeaders) setHeaderImgs(JSON.parse(savedHeaders));

    const savedCV = localStorage.getItem('abinash_cv_url');
    if (savedCV) {
      setCvUrl(savedCV);
      try {
        const byteString = atob(savedCV.split(',')[1]);
        const mimeString = savedCV.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {type: mimeString});
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (e) {
        console.error("Failed to generate blob URL", e);
      }
    }

    const savedExternalCV = localStorage.getItem('abinash_cv_external_url');
    if (savedExternalCV) setCvExternalUrl(savedExternalCV);
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const defaultAspect = croppingType === 'profile' ? 4 / 5 : 16 / 6;
    setAspect(defaultAspect);
    
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        defaultAspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
       const reader = new FileReader();
       reader.onloadend = () => {
         const base64String = reader.result as string;
         setCvUrl(base64String);
         localStorage.setItem('abinash_cv_url', base64String);
         
         // Generate blob URL
         const byteString = atob(base64String.split(',')[1]);
         const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
         const ab = new ArrayBuffer(byteString.length);
         const ia = new Uint8Array(ab);
         for (let i = 0; i < byteString.length; i++) {
           ia[i] = byteString.charCodeAt(i);
         }
         const blob = new Blob([ab], {type: mimeString});
         const url = URL.createObjectURL(blob);
         setBlobUrl(url);
       };
       reader.readAsDataURL(file);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'header') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImg(reader.result as string);
        setCroppingType(type);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    // Limits for storage
    const maxWidth = croppingType === 'profile' ? 800 : 1200;
    const ratio = Math.min(1, maxWidth / completedCrop.width);
    
    canvas.width = completedCrop.width * ratio;
    canvas.height = completedCrop.height * ratio;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      if (croppingType === 'profile') {
        setProfileImg(base64Image);
        localStorage.setItem('abinash_profile_image', base64Image);
      } else {
        const newHeaders = [base64Image, ...headerImgs].slice(0, 3);
        setHeaderImgs(newHeaders);
        localStorage.setItem('abinash_header_images', JSON.stringify(newHeaders));
      }
      
      setIsCropping(false);
      setTempImg(null);
      setImgError(false);
    }
  };

  const formatAuthors = (authors: string) => {
    // Splits by the specific names while keeping delimiters
    const parts = authors.split(/(Bal, A\.|Bal, Abinash|Abinash Bal)/g);
    return parts.map((part, i) => {
      const isUser = part.match(/Bal, A\.|Bal, Abinash|Abinash Bal/);
      return isUser ? (
        <span key={i} className="font-bold underline text-brand-text decoration-brand-accent/50 underline-offset-2">
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  const handleViewCV = () => {
    if (cvExternalUrl) {
      window.open(cvExternalUrl, '_blank');
    } else {
      setIsCVOpen(true);
    }
  };

  const handleExternalUrlChange = (url: string) => {
    setCvExternalUrl(url);
    localStorage.setItem('abinash_cv_external_url', url);
  };

  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
        // Close modal after success
        setTimeout(() => {
          setIsContactOpen(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Contact error:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setIsSending(false);
    }
  };

  const [imgError, setImgError] = useState(false);
  const [galleryItems, setGalleryItems] = useState<{title: string, label: string, type: 'image' | 'video', url: string}[]>([]);
  const [timelineItems, setTimelineItems] = useState<{date: string, text: string, type: 'postdoc' | 'phd' | 'other'}[]>([]);
  const [achievementItems, setAchievementItems] = useState<{year: string, title: string, details: string}[]>([]);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedGallery = localStorage.getItem('abinash_gallery_items');
    if (savedGallery) setGalleryItems(JSON.parse(savedGallery));
    else {
      const defaults = [
        { title: "Triaxial Cell", label: "Rock Deformation", type: 'image', url: '' },
        { title: "Micro-CT", label: "3D Digital Imaging", type: 'image', url: '' },
        { title: "SAXS Stage", label: "Nanopore Analysis", type: 'image', url: '' },
        { title: "High-P Pump", label: "Fluid Injection", type: 'image', url: '' },
        { title: "Core Samples", label: "Deep Saline Reservoirs", type: 'image', url: '' },
        { title: "Scanning EM", label: "Mineral Surface", type: 'image', url: '' }
      ];
      setGalleryItems(defaults as any);
    }

    const savedTimeline = localStorage.getItem('abinash_timeline_items');
    if (savedTimeline) setTimelineItems(JSON.parse(savedTimeline));
    else {
      const defaults = [
        { date: "Mar 2025", text: "Started Post-Doctoral position at The Ohio State University.", type: "postdoc" },
        { date: "Sept 2024", text: "Successfully defended Ph.D. thesis at IIT Kanpur.", type: "phd" }
      ];
      setTimelineItems(defaults as any);
    }

    const savedAchievements = localStorage.getItem('abinash_achievement_items');
    if (savedAchievements) setAchievementItems(JSON.parse(savedAchievements));
    else {
      setAchievementItems(CV_DATA.awards);
    }
  }, []);

  const addAchievementItem = () => {
    const year = prompt("Enter Year:") || new Date().getFullYear().toString();
    const title = prompt("Enter Achievement Title:") || "New Award";
    const details = prompt("Enter Details:") || "";
    if (year && title) {
      const updated = [{ year, title, details }, ...achievementItems];
      setAchievementItems(updated);
      localStorage.setItem('abinash_achievement_items', JSON.stringify(updated));
    }
  };

  const removeAchievementItem = (index: number) => {
    if (window.confirm("Remove this achievement?")) {
      const updated = achievementItems.filter((_, i) => i !== index);
      setAchievementItems(updated);
      localStorage.setItem('abinash_achievement_items', JSON.stringify(updated));
    }
  };

  const addTimelineItem = () => {
    const date = prompt("Enter Date (e.g. Apr 2025):") || "Now";
    const text = prompt("Enter News Text:") || "New announcement...";
    if (date && text) {
      const updated = [{ date, text, type: 'other' as any }, ...timelineItems];
      setTimelineItems(updated);
      localStorage.setItem('abinash_timeline_items', JSON.stringify(updated));
    }
  };

  const removeTimelineItem = (index: number) => {
    if (window.confirm("Remove this news item?")) {
      const updated = timelineItems.filter((_, i) => i !== index);
      setTimelineItems(updated);
      localStorage.setItem('abinash_timeline_items', JSON.stringify(updated));
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check
      if (file.size > 50 * 1024 * 1024) {
        alert("File is too large. Max 50MB allowed.");
        return;
      }

      const formData = new FormData();
      formData.append('media', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        const serverUrl = data.url;

        const replaceIndex = (window as any).replacingGalleryIndex;
        
        let updated;
        if (replaceIndex !== undefined && replaceIndex !== null) {
          updated = [...galleryItems];
          updated[replaceIndex] = {
            ...updated[replaceIndex],
            url: serverUrl,
            type: file.type.startsWith('video') ? 'video' : 'image'
          };
          delete (window as any).replacingGalleryIndex;
        } else {
          const title = prompt("Enter Item Title:", "New Lab Setup") || "New Setup";
          const label = prompt("Enter Description/Label:", "Experimental Work") || "Experimental Work";
          const type = file.type.startsWith('video') ? 'video' : 'image';
          
          const newItem = {
            title,
            label,
            type,
            url: serverUrl
          };
          updated = [...galleryItems, newItem as any];
        }
        
        setGalleryItems(updated);
        localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
        alert("Upload successful!");
      } catch (error) {
        console.error('Upload error:', error);
        alert("Failed to upload file to server. Please try again.");
      }
    }
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const removeGalleryItem = (index: number) => {
    if (window.confirm("Remove this item from gallery?")) {
      const updated = galleryItems.filter((_, i) => i !== index);
      setGalleryItems(updated);
      localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* MIT PEC LAB INSPIRED HERO HEADER */}
      <header className="sticky top-0 z-0 w-full h-[60vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-slate-900">
        {/* Background Image with subtle parallax-ready container */}
        <div className="absolute inset-0 z-0">
          {headerImgs.length > 0 ? (
            <img 
              src={headerImgs[0]} 
              className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" 
              alt="Research Banner" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Camera size={48} className="text-slate-700 opacity-20" />
            </div>
          )}
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
        </div>

        {/* Top Branding Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="font-bold tracking-tighter text-sm sm:text-lg uppercase">OSU | ERDL_IITK</span>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && (
                <button 
                  onClick={() => headerFileInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                  title="Update Personal Banner"
                >
                  <Camera size={16} />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hidden xs:inline">Update Banner</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content - Personalized */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block px-3 py-1 bg-brand-accent text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mb-4 rounded-sm">
              Postdoctoral Researcher
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight font-serif leading-[1.1]">
              Abinash Bal <br className="sm:hidden" />
              <span className="italic font-normal opacity-90 text-xl sm:text-3xl md:text-4xl lg:text-5xl block mt-2 text-brand-accent-foreground">Experimental Rock Mechanics & Petrophysics</span>
            </h1>
            <p className="text-white/80 mt-6 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed border-l-2 border-brand-accent pl-4 sm:pl-6">
              Investigating the rock mechanics, fluid transport and storage in conventional and unconventional nano- to mesoporous reservoir rocks through advanced experimental physics.
            </p>
          </motion.div>
        </div>

        <input 
          type="file" 
          ref={headerFileInputRef} 
          onChange={(e) => handleImageUpload(e, 'header')} 
          accept="image/*" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={cvFileInputRef} 
          onChange={handleCVUpload} 
          accept="application/pdf" 
          className="hidden" 
        />
      </header>

      {/* STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'research', label: 'Research' },
              { id: 'experience', label: 'Experience' },
              { id: 'publications', label: 'Publications' },
              { id: 'awards', label: 'Awards' },
              { id: 'service', label: 'Service' },
              { id: 'gallery', label: 'Laboratory' },
            ].map((nav) => (
              <button 
                key={nav.id} 
                onClick={() => {
                  const el = document.getElementById(nav.id);
                  if (el) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="px-3 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-brand-accent transition-all relative group cursor-pointer whitespace-nowrap"
              >
                {nav.label}
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-brand-accent transition-all group-hover:w-[calc(100%-24px)]"></span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleViewCV}
                className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-accent/5 border border-brand-accent/20 text-brand-accent text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-accent hover:text-white transition-all shadow-sm"
             >
                CV
             </button>
             <button 
              onClick={() => setIsContactOpen(true)}
              className="px-4 md:px-6 py-2 bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md"
             >
                Contact
             </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 bg-[#fafafa] w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-16 pt-12">
      
      {/* LEFT SIDEBAR - Persistent profile & nav */}
      <aside className="w-full md:w-64 lg:w-80 h-auto md:h-screen md:sticky md:top-0 py-8 md:py-20 flex flex-col gap-8 md:overflow-y-auto no-scrollbar">
        
        {/* Profile Card */}
        <div className="flex flex-col md:flex-col gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-48 sm:w-56 md:w-full aspect-[4/5] rounded-2xl bg-brand-sidebar border border-brand-border flex items-center justify-center text-3xl font-serif italic text-brand-accent overflow-hidden relative group shrink-0">
            {(profileImg || (personal.profileImage && !imgError)) ? (
              <img 
                src={profileImg || personal.profileImage} 
                alt={personal.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="animate-pulse-slow">
                {personal.name.split(' ')[0][0]}{personal.name.split(' ')[1][0]}
              </span>
            )}

            {/* Upload Overlay */}
            {isOwner && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="pointer-events-auto p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Upload Profile Photo"
                >
                  <Camera size={20} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => handleImageUpload(e, 'profile')} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{personal.name}</h1>
            <p className="text-sm text-brand-muted mt-1 leading-relaxed">{personal.title}</p>
            <p className="text-xs text-brand-muted font-medium mt-0.5">{personal.subtitle}</p>
          </div>
        </div>

        {/* Contact & Links */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted/70 block">Contact</span>
            <div className="space-y-1">
              <a href={`mailto:${personal.email}`} className="sidebar-link truncate">
                <Mail size={14} className="shrink-0" /> {personal.email}
              </a>
              <a href="mailto:bal.abinash@gmail.com" className="sidebar-link truncate">
                <Mail size={14} className="shrink-0" /> bal.abinash@gmail.com
              </a>
              <div className="sidebar-link">
                <MapPin size={14} className="shrink-0" /> {personal.location}
              </div>
              <a href={personal.googleScholar} target="_blank" rel="noreferrer" className="sidebar-link">
                <Globe size={14} className="shrink-0" /> Google Scholar
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted/70 block">Navigation</span>
            <nav className="flex flex-col">
              <a href="#about" className="sidebar-link active">About</a>
              <a href="#research" className="sidebar-link">Research</a>
              <a href="#experience" className="sidebar-link">Experience</a>
              <a href="#publications" className="sidebar-link">Publications</a>
              <a href="#awards" className="sidebar-link">Honors</a>
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-8 border-t border-brand-border md:block hidden space-y-6">
          <button 
            onClick={handleViewCV}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-muted hover:text-brand-accent transition-colors"
          >
            <BookOpen size={14} /> View CV
          </button>
          
          {isOwner && (
            <div className="p-3 bg-brand-accent/5 border border-brand-accent/20 rounded-xl">
               <div className="flex items-center gap-2 text-brand-accent mb-2">
                 <ShieldCheck size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Owner Mode</span>
               </div>
               <div className="flex flex-col gap-2">
                 <p className="text-[9px] text-brand-muted leading-tight italic">You can now upload media and edit timeline items. Changes are saved to this browser.</p>
                 <button 
                   onClick={() => {
                     if(window.confirm("Reset all custom edits to default CV data?")) {
                       localStorage.removeItem('abinash_gallery_items');
                       localStorage.removeItem('abinash_timeline_items');
                       localStorage.removeItem('abinash_achievement_items');
                       window.location.reload();
                     }
                   }}
                   className="text-[9px] text-brand-accent font-bold uppercase hover:underline text-left mt-2"
                 >
                   Reset to Defaults
                 </button>
               </div>
            </div>
          )}

          <p className="text-[10px] text-brand-muted leading-relaxed">
            &copy; {new Date().getFullYear()} Abinash Bal.<br/>
            Academic Designer Theme.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT - Scrollable content area */}
      <main className="flex-grow py-8 md:py-20 max-w-full md:max-w-3xl">
        
        {/* Existing Timeline & Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-brand-accent"></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent">Recent Timeline</span>
                </div>
                {isOwner && (
                  <button onClick={addTimelineItem} className="text-[10px] uppercase font-bold text-brand-accent hover:underline flex items-center gap-1">
                    <Check size={12} /> Add News
                  </button>
                )}
              </div>
              <div className="space-y-4">
                 {timelineItems.map((item, i) => (
                    <div key={i} className={`flex gap-4 items-start border-l border-brand-border pl-6 relative ${i === 0 ? 'translate-x-2' : ''} ${i !== timelineItems.length - 1 ? 'pb-4' : ''}`}>
                      <div className={`absolute top-1 -left-[5px] w-2 h-2 rounded-full ${item.type === 'postdoc' ? 'bg-brand-accent' : 'bg-slate-300'}`}></div>
                      <span className="text-[10px] font-mono text-brand-muted shrink-0 w-16 pt-1">{item.date}</span>
                      <div className="flex-grow">
                        <p className="text-sm font-medium leading-relaxed">{item.text}</p>
                        {isOwner && (
                          <button onClick={() => removeTimelineItem(i)} className="text-[9px] text-red-400 font-bold uppercase mt-1 hover:underline">Remove</button>
                        )}
                      </div>
                    </div>
                 ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-amber-500"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">Advertisements</span>
              </div>
              <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Award size={14} className="text-amber-500" /> Professional Opportunities
                </h4>
                <ul className="space-y-3">
                  <li className="text-[11px] leading-relaxed text-slate-700">
                    <span className="font-bold text-amber-600 block">Research Collaboration:</span>
                    As a Postdoctoral Researcher at OSU, I am actively looking for multidisciplinary collaborations in multiscale characterization of saline formations and digital rock physics applications for CCUS.
                  </li>
                  <li className="text-[11px] leading-relaxed text-slate-700">
                    <span className="font-bold text-amber-600 block">Industry Partnerships:</span>
                    Seeking partnerships for field-scale validation of experimental pore-network models and carbon storage feasibility studies.
                  </li>
                </ul>
              </div>
            </div>
          </div>

        <motion.section {...sectionFadeIn} id="about" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-6">Introduction</h2>
          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-slate-800 italic font-serif">
               "{personal.researchPhilosophy}"
            </p>
            <p className="text-brand-muted leading-relaxed">
              {personal.longTermGoal}
            </p>
          </div>
        </motion.section>



        <motion.section {...sectionFadeIn} id="research" className="content-section scroll-mt-32">
          <div className="flex flex-col gap-2 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 sm:w-12 bg-brand-accent"></div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent">Scientific Investigations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 pl-11 sm:pl-15">Research Focus</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {researchInterests.map((interest: any, i: number) => {
              const VisualComponent = {
                'triaxial': TriaxialSchematic,
                'micro-ct': MicroCTVisual,
                'nanopore': NanoporeSchematic,
                'flow': FlowSchematic,
                'carbon': CarbonSchematic,
                'petrophysics': PetrophysicsVisual
              }[interest.visualId as string] || (() => null);

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative h-56 perspective-1000 cursor-pointer"
                  onClick={() => setSelectedInterest(interest)}
                >
                  <div className="absolute inset-0 bg-white rounded-[2.5rem] border border-brand-border p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-brand-accent/40">
                    
                    {/* Technical Layer Background */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      <div className="absolute top-0 right-0 w-48 h-48 -mr-8 -mt-8 opacity-[0.08] group-hover:opacity-[0.2] transition-all duration-700 rotate-12 group-hover:rotate-0 scale-125 group-hover:scale-[1.5] text-brand-accent filter blur-[0.5px]">
                        <VisualComponent />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                    </div>

                    {/* Bottom Content: Info */}
                    <div className="relative">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 group-hover:text-brand-accent transition-colors tracking-tight">
                        {interest.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {interest.keywords?.slice(0, 3).map((k: string, ki: number) => (
                          <span key={ki} className="text-[7px] font-mono font-bold text-brand-accent/80 border border-brand-accent/10 px-2 py-0.5 rounded-sm uppercase tracking-widest bg-brand-accent/5">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Corner Indicators */}
                    <div className="absolute bottom-4 left-8 text-[6px] font-mono text-slate-300 tracking-tighter group-hover:text-brand-accent/30 transition-colors uppercase">
                      Core // Explorer <br/>
                      Status // Active
                    </div>

                    {/* Subtle scanner line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-accent/10 shadow-[0_0_10px_rgba(59,130,246,0.2)] -translate-y-full group-hover:animate-scan pointer-events-none"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="experience" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-8">Professional Path</h2>
          <div className="space-y-8">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold group-hover:text-brand-accent transition-colors">{exp.role}</h3>
                  <span className="text-[10px] font-mono text-brand-muted shrink-0 ml-4">{exp.period}</span>
                </div>
                <p className="text-sm text-brand-muted font-bold tracking-widest uppercase mb-3">{exp.organization}</p>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{exp.description}</p>
                {exp.advisor && (
                  <p className="text-xs italic text-brand-muted mt-2">Supervised by {exp.advisor}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="dossier" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-8">Academic Dossier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {education.map((edu: any, i: number) => (
               <div key={i}>
                 <span className="text-[10px] font-mono text-brand-muted block mb-1">{edu.year}</span>
                 <h4 className="text-base font-bold mb-1 leading-tight">{edu.degree}</h4>
                 <p className="text-xs text-brand-muted uppercase tracking-wider font-bold mb-1">{edu.institution}</p>
                 <p className="text-[10px] text-slate-400 italic">{edu.details}</p>
               </div>
             ))}
          </div>
        </motion.section>

        {/* Technical Expertise Section */}
        <motion.section {...sectionFadeIn} className="content-section">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-8">Technical Mastery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
                Analytical Instrumentation
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {skills.instrumentation}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
                Software & Simulation
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {skills.software}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="publications" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-8">Publications</h2>
          
          <div className="space-y-16">
            {/* Journal Articles */}
            <div className="space-y-2">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6">Peer-Reviewed Journal Articles</h4>
               {publications.journalArticles.map((pub: any, i: number) => (
                 <div key={i} className="publication-card group">
                   <div className="flex flex-col gap-1">
                     <h5 className="text-base font-bold leading-snug group-hover:text-brand-accent transition-colors">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)}</p>
                     <div className="flex items-center gap-3 mt-2">
                        <span className="tag">{pub.journal} {pub.year}</span>
                        {pub.impact && <span className="text-[9px] font-mono text-slate-400">Impact Factor: {pub.impact}</span>}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Under Review */}
            <div className="space-y-2">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6">Manuscripts Under Review</h4>
               {publications.underReview.map((pub: any, i: number) => (
                 <div key={i} className="publication-card group border-l-2 border-l-brand-accent/30 pl-4">
                   <div className="flex flex-col gap-1">
                     <h5 className="text-base font-medium leading-snug italic text-slate-700">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)}</p>
                     <div className="flex items-center gap-3 mt-2">
                        <span className="tag bg-brand-sidebar">{pub.journal}</span>
                        <span className="text-[9px] font-mono text-brand-accent uppercase font-bold">{pub.status}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Conference Papers */}
            <div className="space-y-2">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6">Conference Full Papers</h4>
               {publications.conferencePapers.map((pub: any, i: number) => (
                 <div key={i} className="publication-card group">
                   <div className="flex flex-col gap-1">
                     <h5 className="text-base font-bold leading-snug group-hover:text-brand-accent transition-colors">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)} ({pub.year})</p>
                     <p className="text-[10px] text-brand-muted font-medium mt-1 uppercase tracking-tighter italic">{pub.conference}</p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Under Preparation */}
            <div className="space-y-2">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6">Manuscripts Under Preparation</h4>
               {publications.underPreparation.map((pub: any, i: number) => (
                 <div key={i} className="py-3 border-b border-brand-border/30 last:border-0 opacity-75">
                   <h5 className="text-sm font-medium leading-snug text-slate-600">{pub.title}</h5>
                   <p className="text-[10px] text-brand-muted mt-1">{formatAuthors(pub.authors)}</p>
                 </div>
               ))}
            </div>
          </div>
        </motion.section>

        {/* Major Achievements & Honors - MOVED HERE */}
        <motion.section {...sectionFadeIn} id="awards" className="content-section scroll-mt-32">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-brand-accent"></div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent">Major Achievements & Honors</span>
            </div>
            {isOwner && (
              <button 
                onClick={addAchievementItem} 
                className="px-4 py-2 bg-brand-accent/5 border border-brand-accent/20 rounded-xl text-[10px] uppercase font-bold text-brand-accent hover:bg-brand-accent hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Add Achievement
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
             {achievementItems.map((item, i) => (
               <div key={i} className="p-6 md:p-8 bg-white border border-brand-border rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent opacity-20 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[9px] font-bold rounded-lg uppercase tracking-wider">{item.year}</div>
                   {isOwner && (
                     <button 
                        onClick={() => removeAchievementItem(i)} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-full transition-all shadow-sm"
                     >
                       <Trash2 size={14} />
                     </button>
                   )}
                 </div>
                 <h4 className="text-sm font-bold text-slate-800 mb-2 leading-tight group-hover:text-brand-accent transition-colors">{item.title}</h4>
                 <p className="text-[10px] text-brand-muted leading-relaxed italic pr-8">{item.details}</p>
                 <div className="absolute bottom-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity scale-125">
                    <Award size={48} className="text-brand-accent" />
                 </div>
               </div>
             ))}
          </div>
        </motion.section>

        {/* Service Section */}
        <motion.section {...sectionFadeIn} id="service" className="content-section scroll-mt-24">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-12">Professional Service</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-6 flex items-center gap-2">
                  <Globe size={12} className="text-brand-accent" /> Peer Review Activites
                </h4>
                <div className="flex flex-wrap gap-2">
                  {reviewing.map((j: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-brand-border rounded-lg text-[10px] font-bold text-slate-600 hover:border-brand-accent hover:text-brand-accent transition-all cursor-default">
                      {j}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-brand-muted italic leading-relaxed border-l-2 border-brand-accent pl-4">
                Contributing to high-impact journals in Geomechanics, Transport Phenomena, and Sustainable Energy through rigorous peer review.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-6 flex items-center gap-2">
                <Users size={12} className="text-brand-accent" /> Professional Affiliations
              </h4>
              <div className="space-y-3">
                {memberships.map((m: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-1 h-1 rounded-full bg-brand-accent/40 group-hover:scale-150 group-hover:bg-brand-accent transition-all"></div>
                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Laboratory & Instruments Gallery AT BOTTOM */}
        <motion.section {...sectionFadeIn} className="content-section mb-24 scroll-mt-32" id="gallery">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent">Laboratory & Fieldwork</h2>
              <p className="text-[11px] text-brand-muted mt-2 max-w-lg">Advanced experimental setups, specialized core analysis systems, and imaging facilities driving our multiscale investigations.</p>
            </div>
            {isOwner && (
              <div className="flex gap-4">
                <button 
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white text-[10px] uppercase font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={14} /> Add Photo/Video
                </button>
                <input 
                  type="file" 
                  ref={galleryFileInputRef} 
                  onChange={handleGalleryUpload} 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems
              .map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                className="group relative aspect-square rounded-3xl overflow-hidden bg-white border border-brand-border shadow-sm hover:shadow-xl transition-all"
              >
                  {item.url ? (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => {
                        // Open fullscreen view logic could go here
                        if (isOwner && window.confirm("Replace this media?")) {
                            (window as any).replacingGalleryIndex = i;
                            galleryFileInputRef.current?.click();
                        }
                    }}>
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop />
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                      )}
                      
                      {/* Technical Overlay */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[8px] font-mono text-white/80 uppercase tracking-widest border border-white/10">
                            {item.type} // 0{i+1}
                          </span>
                          {isOwner && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeGalleryItem(i); }}
                              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all backdrop-blur-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-bold text-white mb-1 drop-shadow-md">{item.title}</p>
                          <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium drop-shadow-md">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        {isOwner ? <Plus size={24} className="text-brand-accent" /> : <Camera size={24} className="text-slate-300" />}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium leading-relaxed">{item.label}</span>
                      
                      {isOwner && (
                        <button 
                          onClick={() => {
                            (window as any).replacingGalleryIndex = i;
                            galleryFileInputRef.current?.click();
                          }}
                          className="mt-6 px-5 py-2 bg-brand-accent text-white text-[10px] font-bold uppercase rounded-xl hover:shadow-lg transition-all"
                        >
                          Upload Media
                        </button>
                      )}
                    </div>
                  )}
              </motion.div>
            ))}
            
            {isOwner && (
              <motion.button 
                whileHover={{ y: -4, backgroundColor: 'rgba(var(--brand-accent-rgb), 0.05)' }}
                onClick={() => {
                    (window as any).replacingGalleryIndex = null;
                    galleryFileInputRef.current?.click();
                }}
                className="aspect-square rounded-3xl border-2 border-dashed border-brand-border flex flex-col items-center justify-center gap-3 text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-all bg-slate-50/30"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-brand-border flex items-center justify-center shadow-sm">
                  <Plus size={24} />
                </div>
                <div className="text-center px-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest block">Add New Tile</span>
                  <span className="text-[9px] opacity-60 mt-1 block">Image or MP4 Video</span>
                </div>
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* Final CTA */}
        <footer className="pt-20 pb-12 block md:hidden border-t border-brand-border mt-12 text-center">
            <p className="text-[10px] text-brand-muted leading-relaxed">
              &copy; {new Date().getFullYear()} Abinash Bal. Built with modern academic precision.
            </p>
        </footer>

      </main>

        </div>
      </div>

      {/* Cropping Modal */}
      {isCropping && tempImg && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-brand-text/80 backdrop-blur-md" onClick={() => setIsCropping(false)}></div>
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
              <div className="flex-grow">
                <h2 className="text-xl font-bold">
                  {croppingType === 'profile' ? 'Crop Profile Photo' : 'Crop Header Photo'}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] uppercase font-bold text-brand-muted shrink-0">Ratio:</span>
                  <div className="flex gap-1">
                    {[
                      { label: 'Free', val: undefined },
                      { label: '1:1', val: 1 },
                      { label: '4:5', val: 4/5 },
                      { label: '16:9', val: 16/9 },
                      { label: 'Panoramic', val: 16/6 }
                    ].map(btn => (
                      <button 
                        key={btn.label}
                        onClick={() => setAspect(btn.val)}
                        className={`px-2 py-1 text-[9px] font-bold rounded-md border transition-all ${
                          aspect === btn.val 
                            ? 'bg-brand-accent text-white border-brand-accent' 
                            : 'bg-white text-brand-muted border-brand-border hover:border-brand-accent'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsCropping(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-brand-border ml-4"
              >
                <X size={20} className="text-brand-muted" />
              </button>
            </div>

            <div className="p-6 flex items-center justify-center bg-slate-100 max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={aspect}
                circularCrop={false}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={tempImg}
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="p-6 border-t border-brand-border bg-slate-50/50 flex justify-end gap-3">
               <button 
                onClick={() => setIsCropping(false)}
                className="px-6 py-2 border border-brand-border rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
               >
                 Cancel
               </button>
               <button 
                onClick={getCroppedImg}
                className="px-6 py-2 bg-brand-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
               >
                 <Check size={14} /> Apply Crop
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Research Backdrop Modal */}
      {selectedInterest && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-brand-text/60 backdrop-blur-sm" onClick={() => setSelectedInterest(null)}></div>
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 md:p-10 border-b border-brand-border flex justify-between items-start bg-slate-50/50">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-3 block">Research Spotlight</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">{selectedInterest.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedInterest(null)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-brand-border"
              >
                <X size={24} className="text-brand-muted" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Visual Representation */}
                <div className="bg-slate-900 border border-brand-border rounded-3xl aspect-video sm:aspect-square flex items-center justify-center relative overflow-hidden group shadow-inner">
                  {selectedInterest.videoUrl ? (
                    <video 
                      key={selectedInterest.id}
                      autoPlay 
                      muted 
                      loop 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    >
                      <source src={selectedInterest.videoUrl} type="video/mp4" />
                    </video>
                  ) : selectedInterest.imageUrl && (
                    <img 
                      src={selectedInterest.imageUrl} 
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                      alt={selectedInterest.title}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  
                  <div className="w-full h-full max-w-[200px] sm:max-w-[300px] flex items-center justify-center relative z-10 text-white/40 group-hover:text-white/80 transition-colors drop-shadow-2xl">
                    {selectedInterest.visualId === 'triaxial' && <TriaxialSchematic />}
                    {selectedInterest.visualId === 'micro-ct' && <MicroCTVisual />}
                    {selectedInterest.visualId === 'nanopore' && <NanoporeSchematic />}
                    {selectedInterest.visualId === 'flow' && <FlowSchematic />}
                    {selectedInterest.visualId === 'carbon' && <CarbonSchematic />}
                    {selectedInterest.visualId === 'petrophysics' && <PetrophysicsVisual />}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="text-[8px] font-mono text-white/50 tracking-widest uppercase">Visual Model // 0.8.2</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted flex items-center gap-2">
                    <BookOpen size={12} className="text-brand-accent" /> Focus & Methodology
                  </h4>
                  <p className="text-xl font-serif italic text-slate-700 leading-relaxed border-l-4 border-brand-accent/20 pl-6">
                    {selectedInterest.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedInterest.keywords?.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white border border-brand-border rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-muted">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Publications */}
              <section>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6 flex items-center gap-2">
                  <Globe size={12} className="text-brand-accent" /> Published Contributions
                </h4>
                <div className="space-y-4">
                  {[...publications.journalArticles, ...publications.underReview, ...publications.conferencePapers]
                    .filter(pub => 
                      selectedInterest.keywords?.some((kw: string) => 
                        pub.title.toLowerCase().includes(kw.toLowerCase()) || 
                        pub.journal?.toLowerCase().includes(kw.toLowerCase())
                      )
                    )
                    .map((pub, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-brand-border/50 hover:border-brand-accent group transition-all">
                        <h5 className="text-md font-bold mb-1 group-hover:text-brand-accent transition-colors">{pub.title}</h5>
                        <p className="text-xs text-brand-muted mb-2">{formatAuthors(pub.authors)}</p>
                        <div className="flex items-center gap-3">
                          <span className="tag">{pub.journal || pub.conference} {pub.year || ''}</span>
                          {pub.impact && <span className="text-[9px] font-mono text-slate-400">IF: {pub.impact}</span>}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-brand-border bg-slate-50/50 flex justify-end">
               <button 
                onClick={() => setSelectedInterest(null)}
                className="px-6 py-2 bg-brand-text text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors"
               >
                 Close Detail
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* CV Modal */}
      <AnimatePresence>
        {isCVOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-brand-border bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">Curriculum Vitae</span>
                  <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">Abinash_Bal_CV.pdf</h2>
                </div>
                {cvExternalUrl && (
                  <>
                    <div className="h-4 w-[1px] bg-brand-border mx-2 hidden sm:block"></div>
                    <a 
                      href={cvExternalUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-brand-accent hover:underline flex items-center gap-1 font-bold uppercase tracking-widest hidden sm:flex"
                    >
                      <Globe size={12} /> External Link
                    </a>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {blobUrl && (
                  <a 
                    href={blobUrl} 
                    download="Abinash_Bal_CV.pdf"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-brand-accent flex items-center gap-2"
                    title="Download PDF"
                  >
                    <Download size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Download PDF</span>
                  </a>
                )}
                <button 
                  onClick={() => setIsCVOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-2"
                  title="Close"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-grow bg-slate-100 overflow-hidden relative overflow-y-auto no-scrollbar">
              {blobUrl ? (
                <div className="w-full h-full flex flex-col bg-white">
                  <object 
                    data={`${blobUrl}#view=FitH`} 
                    type="application/pdf" 
                    className="w-full h-full border-none"
                    style={{ minHeight: 'calc(100vh - 64px)' }}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                      <FileText size={48} className="text-brand-accent mb-4 opacity-20" />
                      <h3 className="text-lg font-bold mb-2">PDF Preview Unavailable</h3>
                      <p className="text-sm text-brand-muted max-w-md mb-6">
                        Your browser or security settings are preventing the embedded PDF viewer from loading. You can still download the file to view it.
                      </p>
                      <a 
                        href={blobUrl} 
                        download="Abinash_Bal_CV.pdf"
                        className="px-8 py-3 bg-brand-accent text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-slate-900 transition-all shadow-lg"
                      >
                        Download PDF CV
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white shadow-xl min-h-screen my-8 p-8 md:p-16 rounded-[2rem]">
                  {/* Digital CV as Fallback/Option */}
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2 tracking-tight uppercase">ABINASH BAL, Ph.D.</h1>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                      Post-Doctoral Researcher | School of Earth Sciences, The Ohio State University
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mt-6 text-[11px] font-bold text-brand-accent uppercase tracking-widest">
                       <span>{personal.email}</span>
                       <span>{personal.location}</span>
                    </div>
                  </div>

                  <section className="mb-12">
                    <h3 className="text-xs uppercase font-bold tracking-[0.3em] text-brand-accent border-b border-brand-border pb-3 mb-6">Education</h3>
                    <div className="space-y-8">
                       {education.map((edu: any, i: number) => (
                         <div key={i} className="flex">
                            <div className="w-32 shrink-0 text-xs font-bold text-slate-400">{edu.year}</div>
                            <div>
                              <h4 className="text-lg font-bold">{edu.degree}</h4>
                              <p className="text-brand-accent font-semibold text-sm">{edu.institution}</p>
                              <p className="text-xs text-slate-500 mt-2 italic font-serif opacity-80">{edu.details}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>

                  <section className="mb-12">
                    <h3 className="text-xs uppercase font-bold tracking-[0.3em] text-brand-accent border-b border-brand-border pb-3 mb-6">Experience</h3>
                    <div className="space-y-8">
                       {experience.map((exp: any, i: number) => (
                         <div key={i} className="flex">
                            <div className="w-32 shrink-0 text-xs font-bold text-slate-400">{exp.period}</div>
                            <div>
                              <h4 className="text-lg font-bold">{exp.role}</h4>
                              <p className="text-brand-accent font-semibold text-sm">{exp.organization}</p>
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>

                  {isOwner && (
                    <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                      <FileText size={40} className="text-slate-300 mb-4" />
                      <p className="text-sm font-medium text-slate-500 mb-4">Would you like to replace this digital summary with your full PDF CV or a Google Drive link?</p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <button 
                          onClick={() => cvFileInputRef.current?.click()}
                          className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-colors"
                        >
                          Upload PDF CV
                        </button>
                        <button 
                          onClick={() => {
                            const url = prompt("Enter Google Drive CV Link:", cvExternalUrl || "");
                            if (url !== null) handleExternalUrlChange(url);
                          }}
                          className="px-6 py-2 border border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-50 transition-colors"
                        >
                          Set Drive Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-brand-text/60 backdrop-blur-sm" onClick={() => setIsContactOpen(false)}></div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Get In Touch</span>
                  <h2 className="text-2xl font-bold">Inquiry & Collaboration</h2>
                </div>
                <button 
                  onClick={() => setIsContactOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-brand-border"
                >
                  <X size={24} className="text-brand-muted" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="p-8 space-y-6">
                {submitStatus && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all"
                    placeholder="Research Collaboration Query"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <button 
                  disabled={isSending}
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-slate-900/10"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
