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
  Expand,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Edit3,
  Lock,
  LogOut,
  KeyRound,
  Loader2,
  GripHorizontal
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CV_DATA } from './constants';
import { auth } from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  User
} from 'firebase/auth';

import { 
  TriaxialSchematic, 
  MicroCTVisual, 
  NanoporeSchematic, 
  FlowSchematic, 
  CarbonSchematic,
  PetrophysicsVisual
} from './components/ResearchVisuals';

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const sectionFadeIn = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const GalleryCard = ({ item, i, isOwner, removeGalleryItem, updateGalleryItem, galleryFileInputRef }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [item?.url]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || `gallery-${i}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).replacingGalleryIndex = i;
    galleryFileInputRef.current?.click();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeGalleryItem(i);
  };

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      whileHover={!isDragging ? { y: -4 } : undefined}
      className={`group relative aspect-square rounded-3xl overflow-hidden bg-white border border-brand-border shadow-sm hover:shadow-xl transition-all ${isDragging ? 'opacity-40 cursor-grabbing' : ''} ${isOwner && (!item.url || hasError) ? 'cursor-pointer hover:border-brand-accent/50' : ''}`}
      id={`gallery-item-${i}`}
      onClick={(e) => {
        if (isOwner && (!item.url || hasError)) {
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('.meta-edit-zone')) {
            (window as any).replacingGalleryIndex = i;
            galleryFileInputRef.current?.click();
          }
        }
      }}
    >
        {item.url && !hasError ? (
          <div className="w-full h-full relative">
            {item.type === 'video' ? (
              <div className="w-full h-full relative group/video">
                <video 
                  ref={videoRef}
                  src={item.url} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted={isMuted} 
                  loop 
                  playsInline
                  onError={(e) => {
                    if (hasError) return;
                    setHasError(true);
                    const video = e.currentTarget as HTMLVideoElement;
                    video.src = "https://assets.mixkit.co/videos/preview/mixkit-scientific-process-in-a-laboratory-41221-large.mp4";
                    video.load();
                  }}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/video:opacity-100 transition-all z-10">
                  <div className="flex gap-4 pointer-events-auto">
                    <button 
                      onClick={togglePlay}
                      className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all scale-90 hover:scale-100 cursor-pointer"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all scale-90 hover:scale-100 cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={item.url} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
                alt={item.title} 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (!hasError) {
                    setHasError(true);
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=800";
                  }
                }}
              />
            )}
            
            {/* Technical Overlay */}
            <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-6 z-20 pointer-events-none group-hover:pointer-events-auto">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[8px] font-mono text-white/80 uppercase tracking-widest border border-white/10">
                    {item.title}
                  </span>
                  {isOwner && (
                    <div 
                      {...attributes} 
                      {...listeners} 
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl transition-all border border-white/30 cursor-grab active:cursor-grabbing pointer-events-auto shadow-lg"
                      title="Drag to rearrange"
                    >
                      <GripHorizontal size={18} />
                    </div>
                  )}
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateGalleryItem(i); }}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/20 active:scale-95 cursor-pointer"
                      title="Edit Title/Label"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={handleReplace}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/20 active:scale-95 cursor-pointer"
                      title="Replace Media"
                      id={`replace-gallery-${i}`}
                    >
                      <Upload size={16} />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all shadow-xl border border-white/20 active:scale-95 cursor-pointer"
                      title="Delete Item"
                      id={`delete-gallery-${i}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div 
                className={`mt-auto ${isOwner ? 'cursor-pointer pointer-events-auto hover:bg-white/10 p-2 rounded-xl transition-all' : 'pointer-events-none'}`}
                onClick={isOwner ? () => updateGalleryItem(i) : undefined}
                title={isOwner ? "Click to edit title and label" : ""}
              >
                <p className="text-sm font-bold text-white mb-1 drop-shadow-md underline decoration-brand-accent/30 underline-offset-4 flex items-center gap-2">
                  {item.title}
                  {isOwner && <Edit3 size={10} className="text-brand-accent/70" />}
                </p>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium drop-shadow-md">{item.label}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
            {isOwner && item.url && (
              <button 
                onClick={handleDelete}
                className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100 z-30"
                title="Remove broken item"
              >
                <Trash2 size={14} />
              </button>
            )}

            {isOwner && (
               <div 
                {...attributes} 
                {...listeners} 
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-lg transition-all border border-slate-200 cursor-grab active:cursor-grabbing z-30"
                title="Drag to rearrange"
              >
                <GripHorizontal size={14} />
              </div>
            )}
            
            <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              {isOwner ? <Plus size={24} className="text-brand-accent" /> : <Camera size={24} className="text-slate-300" />}
            </div>
            <div 
              className={`flex flex-col items-center p-4 rounded-2xl transition-all meta-edit-zone ${isOwner ? 'cursor-pointer hover:bg-slate-100/50' : ''}`}
              onClick={isOwner ? (e) => { e.stopPropagation(); updateGalleryItem(i); } : undefined}
              title={isOwner ? "Click to edit title and label" : ""}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 flex items-center gap-2">
                {hasError ? "Media Unavailable" : (item.title || "Empty Slot")}
                {isOwner && <Edit3 size={10} className="text-brand-accent/50 group-hover:text-brand-accent" />}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
                {hasError ? "Could not load laboratory asset." : (item.label || "Awaiting research documentation.")}
              </span>
            </div>
            
            {isOwner && (
              <button 
                onClick={() => {
                  (window as any).replacingGalleryIndex = i;
                  galleryFileInputRef.current?.click();
                }}
                className="mt-6 px-5 py-2 bg-brand-accent text-white text-[10px] font-bold uppercase rounded-xl hover:shadow-lg transition-all cursor-pointer"
              >
                {hasError ? "Try Again" : "Upload Media"}
              </button>
            )}
          </div>
        )}
    </motion.div>
  );
};

export default function App() {
  console.log("App component rendering...");
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'bal.abinash@gmail.com', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isResetSending, setIsResetSending] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRegisteringMode, setIsRegisteringMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [croppingType, setCroppingType] = useState<'profile' | 'header'>('profile');
  const [isEditingGalleryItem, setIsEditingGalleryItem] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [editGalleryData, setEditGalleryData] = useState({ title: '', label: '' });
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [achievementForm, setAchievementForm] = useState({ year: '', title: '', details: '' });
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [timelineForm, setTimelineForm] = useState({ date: '', text: '' });
  const [isAddingResearch, setIsAddingResearch] = useState(false);
  const [researchForm, setResearchForm] = useState({ title: '', description: '' });
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryUploadForm, setGalleryUploadForm] = useState({ title: '', label: '', url: '', type: 'image' });
  const [isEditingCvLink, setIsEditingCvLink] = useState(false);
  const [cvLinkInput, setCvLinkInput] = useState('');
  const [isEditingDoi, setIsEditingDoi] = useState(false);
  const [doiInput, setDoiInput] = useState('');
  const [editingPubTarget, setEditingPubTarget] = useState<{ category: string, index: number } | null>(null);
  const [pubArticles, setPubArticles] = useState<any[]>(CV_DATA.publications?.journalArticles || []);
  const [pubConferences, setPubConferences] = useState<any[]>(CV_DATA.publications?.conferencePapers || []);
  const [pubUnderReview, setPubUnderReview] = useState<any[]>(CV_DATA.publications?.underReview || []);
  const [pubPreparation, setPubPreparation] = useState<any[]>(CV_DATA.publications?.underPreparation || []);
  const [siteData, setSiteData] = useState<any>(CV_DATA);

  // Persistence logic
  const saveAllToServer = async (dataToSave: any) => {
    if (!isOwner) return;
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      console.log('Site data synced to server');
    } catch (err) {
      console.error('Failed to sync data to server', err);
    }
  };
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<{ path: string, value: string, title: string, type: 'text' | 'textarea' | 'image' } | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === 'bal.abinash@gmail.com') {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setIsLoginOpen(true);
    }
    const savedProfile = localStorage.getItem('abinash_profile_image');
    if (savedProfile) setProfileImg(savedProfile);

    const savedHeaders = localStorage.getItem('abinash_header_images');
    if (savedHeaders) setHeaderImgs(JSON.parse(savedHeaders));

    const savedCV = localStorage.getItem('abinash_cv_url');
    if (savedCV) {
      setCvUrl(savedCV);
      if (savedCV.startsWith('data:')) {
        try {
          const byteString = atob(savedCV.split(',')[1]);
          const mimeString = savedCV.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], {type: mimeString});
          setBlobUrl(URL.createObjectURL(blob));
        } catch (e) {
          console.error("Failed to generate blob URL from base64", e);
        }
      } else {
        setBlobUrl(savedCV);
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

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
       // Also upload to server
       const formData = new FormData();
       formData.append('media', file);
       
       try {
         const response = await fetch('/api/upload', {
           method: 'POST',
           body: formData,
         });
         const data = await response.json();
         const serverUrl = data.url;
         
         setCvUrl(serverUrl);
         // We can still use blob for immediate preview
         const url = URL.createObjectURL(file);
         setBlobUrl(url);
         
         if (isOwner) {
           localStorage.setItem('abinash_cv_url', serverUrl);
         }
       } catch (err) {
         console.error('Failed to upload CV', err);
         // Fallback to base64
         const reader = new FileReader();
         reader.onloadend = () => {
           const base64String = reader.result as string;
           setCvUrl(base64String);
           localStorage.setItem('abinash_cv_url', base64String);
           
           const url = URL.createObjectURL(file);
           setBlobUrl(url);
         };
         reader.readAsDataURL(file);
       }
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
      
      // Upload to server to avoid localStorage limits and ensure persistence
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append('media', blob, `crop-${Date.now()}.jpg`);
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          const serverUrl = data.url;

          if (croppingType === 'profile') {
            setProfileImg(serverUrl);
            localStorage.setItem('abinash_profile_image', serverUrl);
            
            // Also update siteData if it exists
            if (siteData) {
              setSiteData((prev: any) => ({
                ...prev,
                personal: { ...prev.personal, profileImage: serverUrl }
              }));
            }
          } else {
            const newHeaders = [serverUrl, ...headerImgs.filter(url => !url.startsWith('data:'))].slice(0, 3);
            setHeaderImgs(newHeaders);
            localStorage.setItem('abinash_header_images', JSON.stringify(newHeaders));

            // Also update siteData headerImage
            if (siteData) {
              setSiteData((prev: any) => ({
                ...prev,
                personal: { ...prev.personal, headerImage: serverUrl }
              }));
            }
          }
        } catch (err) {
          console.error('Failed to upload cropped image', err);
          // Fallback to base64 if upload fails
          if (croppingType === 'profile') {
            setProfileImg(base64Image);
          } else {
            setHeaderImgs([base64Image, ...headerImgs].slice(0, 3));
          }
        }
      }, 'image/jpeg', 0.8);
      
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

  const galleryDefaults: any[] = [
    {
      "title": "Wille Geotechnik System",
      "label": "Advanced Triaxial Testing Facility",
      "type": "image",
      "url": "/uploads/media-1778605534625-390481291.JPG"
    },
    {
      "title": "HP-T Triaxial Compression",
      "label": "High-Pressure Experimental Lab",
      "type": "image",
      "url": "/uploads/media-1778605539824-797057083.JPG"
    },
    {
      "title": "HeloScan_XCT",
      "label": "Precision Micro-CT Analysis",
      "type": "image",
      "url": "/uploads/media-1778605615371-876077451.jpeg"
    },
    {
      "title": "Batch Reactor",
      "label": "Geochemical Pressure Vessel",
      "type": "image",
      "url": "/uploads/media-1778605627583-150102978.jpeg"
    },
    {
      "title": "SEM Characterization",
      "label": "Field Emission Scanning Microscopy",
      "type": "image",
      "url": "/uploads/media-1778605636787-115580303.jpeg"
    },
    {
      "title": "PDP System",
      "label": "Pulse Decay Permeability Setup",
      "type": "image",
      "url": "/uploads/media-1778605648000-656309316.jpg"
    },
    {
      "title": "Gas Pycnometer",
      "label": "Skeletal Density Determination",
      "type": "image",
      "url": "/uploads/media-1778605658389-65390783.jpg"
    }
  ].map((item, idx) => ({ ...item, id: `gallery-default-${idx}` }));

    const timelineDefaults = [
      { date: "Mar 2025", text: "Started Post-Doctoral position at The Ohio State University.", type: "postdoc" },
      { date: "Sept 2024", text: "Successfully defended Ph.D. thesis at IIT Kanpur.", type: "phd" }
    ];

    const [researchInterestsState, setResearchInterestsState] = useState<any[]>(CV_DATA.researchInterests || []);
    const [imgError, setImgError] = useState(false);
    const [galleryItems, setGalleryItems] = useState<{title: string, label: string, type: 'image' | 'video', url: string}[]>(galleryDefaults);
    const [timelineItems, setTimelineItems] = useState<{date: string, text: string, type: 'postdoc' | 'phd' | 'other'}[]>(timelineDefaults as any);
  const [achievementItems, setAchievementItems] = useState<{year: string, title: string, details: string}[]>(CV_DATA.awards || []);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Persistent data loading from server
    const loadFromPersistence = async () => {
      console.log("Starting loadFromPersistence...");
      try {
        const response = await fetch('/api/site-data');
        if (!response.ok) throw new Error("Server responded with error");
        const serverData = await response.json();
        console.log("Server data received:", serverData);
        
        if (serverData && Object.keys(serverData).length > 0) {
          console.log("Merging data from server persistence");
          
          if (serverData.researchInterestsState && Array.isArray(serverData.researchInterestsState) && serverData.researchInterestsState.length > 0) {
            setResearchInterestsState(serverData.researchInterestsState);
          } else {
            setResearchInterestsState(CV_DATA.researchInterests || []);
          }

          if (serverData.galleryItems && Array.isArray(serverData.galleryItems) && serverData.galleryItems.length > 0) {
            setGalleryItems(serverData.galleryItems.map((item: any, idx: number) => ({
              ...item,
              id: item.id || `gallery-${idx}-${Date.now()}`
            })));
          } else {
            console.log("Using gallery defaults as server returned empty");
            setGalleryItems(galleryDefaults);
          }

          if (serverData.timelineItems && Array.isArray(serverData.timelineItems) && serverData.timelineItems.length > 0) {
            setTimelineItems(serverData.timelineItems);
          } else {
            setTimelineItems(timelineDefaults);
          }

          if (serverData.achievementItems && Array.isArray(serverData.achievementItems) && serverData.achievementItems.length > 0) {
            setAchievementItems(serverData.achievementItems);
          } else {
            setAchievementItems(CV_DATA.awards || []);
          }

          if (Array.isArray(serverData.pubArticles)) setPubArticles(serverData.pubArticles);
          if (Array.isArray(serverData.pubConferences)) setPubConferences(serverData.pubConferences);
          if (Array.isArray(serverData.pubUnderReview)) setPubUnderReview(serverData.pubUnderReview);
          if (Array.isArray(serverData.pubPreparation)) setPubPreparation(serverData.pubPreparation);
          
          if (serverData.siteData) {
            setSiteData({ ...CV_DATA, ...serverData.siteData });
          } else {
            setSiteData(CV_DATA);
          }

          if (serverData.profileImg) setProfileImg(serverData.profileImg);
          if (serverData.headerImgs) setHeaderImgs(serverData.headerImgs);
          if (serverData.cvUrl) {
            setCvUrl(serverData.cvUrl);
            setBlobUrl(serverData.cvUrl); 
          }
          if (serverData.cvExternalUrl) setCvExternalUrl(serverData.cvExternalUrl);
          return;
        }
      } catch (err) {
        console.error("Failed to load from server, using local fallback", err);
      }

      console.log("Proceeding with local fallback...");
      // FALLBACK TO LOCAL STORAGE
      const savedInterests = localStorage.getItem('abinash_research_interests');
      let interestsInstance = [];
      if (savedInterests) {
        try {
          interestsInstance = JSON.parse(savedInterests);
          const hasRockMechanics = interestsInstance.some((ri: any) => ri.id === 'rock-mechanics' || ri.title.includes('Rock Mechanics'));
          if (!hasRockMechanics) {
            const rockMechanicsDefault = researchInterests.find((ri: any) => ri.id === 'rock-mechanics');
            if (rockMechanicsDefault) interestsInstance.unshift(rockMechanicsDefault);
          }
        } catch (e) { interestsInstance = researchInterests; }
      } else interestsInstance = researchInterests;
      setResearchInterestsState(interestsInstance || []);

      const savedGallery = localStorage.getItem('abinash_gallery_items');
      if (savedGallery) {
        try {
          const parsed = JSON.parse(savedGallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized = parsed.map((item: any, idx: number) => ({
              ...item,
              id: item.id || `gallery-${idx}-${Date.now()}`
            }));
            setGalleryItems(normalized);
          } else setGalleryItems(galleryDefaults);
        } catch (e) { setGalleryItems(galleryDefaults); }
      } else setGalleryItems(galleryDefaults);

      const savedTimeline = localStorage.getItem('abinash_timeline_items');
      if (savedTimeline) try { setTimelineItems(JSON.parse(savedTimeline)); } catch(e) { setTimelineItems(timelineDefaults); }
      else setTimelineItems(timelineDefaults);

      const savedAchievements = localStorage.getItem('abinash_achievement_items');
      if (savedAchievements) try { setAchievementItems(JSON.parse(savedAchievements)); } catch(e) { setAchievementItems(CV_DATA.awards); }
      else setAchievementItems(CV_DATA.awards);

      const savedArticles = localStorage.getItem('abinash_pub_articles');
      if (savedArticles) try { setPubArticles(JSON.parse(savedArticles)); } catch(e) { setPubArticles(publications.journalArticles); }
      else setPubArticles(publications.journalArticles);

      const savedConferences = localStorage.getItem('abinash_pub_conferences');
      if (savedConferences) try { setPubConferences(JSON.parse(savedConferences)); } catch(e) { setPubConferences(publications.conferencePapers); }
      else setPubConferences(publications.conferencePapers);

      const savedUnderReview = localStorage.getItem('abinash_pub_under_review');
      if (savedUnderReview) try { setPubUnderReview(JSON.parse(savedUnderReview)); } catch(e) { setPubUnderReview(publications.underReview); }
      else setPubUnderReview(publications.underReview);

      const savedPreparation = localStorage.getItem('abinash_pub_preparation');
      if (savedPreparation) try { setPubPreparation(JSON.parse(savedPreparation)); } catch(e) { setPubPreparation(publications.underPreparation); }
      else setPubPreparation(publications.underPreparation);

      const savedSiteData = localStorage.getItem('abinash_site_data');
      if (savedSiteData) try { setSiteData(JSON.parse(savedSiteData)); } catch(e) { setSiteData(CV_DATA); }
      else setSiteData(CV_DATA);
    };

    loadFromPersistence();
  }, []);

  // Debounced server sync effect
  useEffect(() => {
    if (!siteData || !isOwner) return;
    
    const timeout = setTimeout(() => {
      const dataToSave = {
        siteData,
        galleryItems,
        researchInterestsState,
        timelineItems,
        achievementItems,
        pubArticles,
        pubConferences,
        pubUnderReview,
        pubPreparation,
        profileImg,
        headerImgs,
        cvUrl,
        cvExternalUrl
      };
      
      saveAllToServer(dataToSave);
      
      // Secondary backup in localStorage
      localStorage.setItem('abinash_site_data', JSON.stringify(siteData));
      localStorage.setItem('abinash_gallery_items', JSON.stringify(galleryItems));
      localStorage.setItem('abinash_research_interests', JSON.stringify(researchInterestsState));
      localStorage.setItem('abinash_timeline_items', JSON.stringify(timelineItems));
      localStorage.setItem('abinash_achievement_items', JSON.stringify(achievementItems));
      localStorage.setItem('abinash_pub_articles', JSON.stringify(pubArticles));
      localStorage.setItem('abinash_pub_conferences', JSON.stringify(pubConferences));
      localStorage.setItem('abinash_pub_under_review', JSON.stringify(pubUnderReview));
      localStorage.setItem('abinash_pub_preparation', JSON.stringify(pubPreparation));
      if (profileImg) localStorage.setItem('abinash_profile_image', profileImg);
      if (cvUrl) localStorage.setItem('abinash_cv_url', cvUrl);
      localStorage.setItem('abinash_header_images', JSON.stringify(headerImgs));
    }, 2000); // 2 second debounce
    
    return () => clearTimeout(timeout);
  }, [siteData, galleryItems, researchInterestsState, timelineItems, achievementItems, pubArticles, pubConferences, pubUnderReview, pubPreparation, profileImg, headerImgs, cvUrl, cvExternalUrl]);

  const clearGallery = () => {
    if (window.confirm("Delete ALL items in the gallery? This cannot be undone.")) {
      setGalleryItems([]);
      localStorage.setItem('abinash_gallery_items', JSON.stringify([]));
    }
  };

  const addAchievementItem = () => {
    setAchievementForm({ year: new Date().getFullYear().toString(), title: '', details: '' });
    setIsAddingAchievement(true);
  };

  const saveAchievementItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (achievementForm.year && achievementForm.title) {
      const updated = [{ ...achievementForm }, ...achievementItems];
      setAchievementItems(updated);
      localStorage.setItem('abinash_achievement_items', JSON.stringify(updated));
      setIsAddingAchievement(false);
    }
  };

  const removeAchievementItem = (index: number) => {
    setAchievementItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('abinash_achievement_items', JSON.stringify(updated));
      return updated;
    });
  };

  const addTimelineItem = () => {
    setTimelineForm({ date: '', text: '' });
    setIsAddingTimeline(true);
  };

  const saveTimelineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (timelineForm.date && timelineForm.text) {
      setTimelineItems(prev => {
        const updated = [{ ...timelineForm, type: 'other' as any }, ...prev];
        localStorage.setItem('abinash_timeline_items', JSON.stringify(updated));
        return updated;
      });
      setIsAddingTimeline(false);
    }
  };

  const removeTimelineItem = (index: number) => {
    setTimelineItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('abinash_timeline_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setIsLoginOpen(false);
      setLoginForm(prev => ({ ...prev, password: '' }));
      setIsRegisteringMode(false);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setLoginError("Invalid email or password. If you haven't created an account yet, switch to 'Create Account' mode below.");
      } else if (error.code === 'auth/user-not-found') {
        setLoginError("User not found. You may need to create an account first.");
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError("Too many failed attempts. Please try again later.");
      } else if (error.code === 'auth/operation-not-allowed') {
        setLoginError("Email/Password login is not enabled in Firebase.");
      } else {
        setLoginError(`Authentication failed: ${error.message}`);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email !== 'bal.abinash@gmail.com') {
      setLoginError("Registration is restricted to the administrator email only.");
      return;
    }
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      await createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setIsLoginOpen(false);
      setLoginForm(prev => ({ ...prev, password: '' }));
      setIsRegisteringMode(false);
      alert("Owner account successfully created and logged in!");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setLoginError("This email is already registered. Please switch to 'Login' mode.");
      } else {
        setLoginError(error.message || "Failed to create account.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleResetPassword = async () => {
    if (!loginForm.email) {
      setLoginError("Please enter your email to receive a reset link.");
      return;
    }
    setIsResetSending(true);
    setResetStatus(null);
    try {
      await sendPasswordResetEmail(auth, loginForm.email);
      setResetStatus({ type: 'success', message: "Password reset email sent! Please check your inbox." });
    } catch (error: any) {
      console.error("Reset error:", error);
      setResetStatus({ type: 'error', message: "Could not send reset email. Verify your address." });
    } finally {
      setIsResetSending(false);
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

        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          let errorMessage = 'Upload failed';
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = `Server error (${response.status}): ${text.substring(0, 100)}`;
          }
          throw new Error(errorMessage);
        }

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response. Please ensure the server is configured correctly.');
        }

        const data = await response.json();
        const serverUrl = data.url;

        const replaceIndex = (window as any).replacingGalleryIndex;
        
        if (replaceIndex !== undefined && replaceIndex !== null) {
          setGalleryItems(prev => {
            const updated = [...prev];
            updated[replaceIndex] = {
              ...updated[replaceIndex],
              url: serverUrl,
              type: file.type.startsWith('video') ? 'video' : 'image'
            };
            localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
            return updated;
          });
          delete (window as any).replacingGalleryIndex;
        } else {
          setGalleryUploadForm({
            title: "Laboratory Equipment",
            label: "Experimental Setup",
            url: serverUrl,
            type: file.type.startsWith('video') ? 'video' : 'image'
          });
          setIsAddingGallery(true);
        }
        alert("Media uploaded! Now please provide details.");
      } catch (error) {
        console.error('Upload error:', error);
        alert(error instanceof Error ? error.message : "Upload failed.");
      }
    }
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setGalleryItems((items) => {
        const oldIndex = items.findIndex((item, idx) => (item.id || `gallery-${idx}`) === active.id);
        const newIndex = items.findIndex((item, idx) => (item.id || `gallery-${idx}`) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveGalleryNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryItems(prev => {
      const newItem = { ...galleryUploadForm, id: `gallery-${Date.now()}` } as any;
      const updated = [...prev, newItem];
      localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
      return updated;
    });
    setIsAddingGallery(false);
  };

  const removeGalleryItem = (index: number) => {
    setGalleryItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
      return updated;
    });
  };

  const updateGalleryItem = (index: number) => {
    const item = galleryItems[index];
    setEditingGalleryIndex(index);
    setEditGalleryData({ title: item.title || "", label: item.label || "" });
    setIsEditingGalleryItem(true);
  };

  const handleUpdateDoi = (category: string, index: number, currentDoi: string) => {
    setEditingPubTarget({ category, index });
    setDoiInput(currentDoi || '');
    setIsEditingDoi(true);
  };

  const saveDoiUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPubTarget) return;

    const { category, index } = editingPubTarget;
    if (category === 'journalArticles') {
      const updated = [...pubArticles];
      updated[index] = { ...updated[index], doi: doiInput };
      setPubArticles(updated);
      localStorage.setItem('abinash_pub_articles', JSON.stringify(updated));
    } else if (category === 'conferencePapers') {
      const updated = [...pubConferences];
      updated[index] = { ...updated[index], doi: doiInput };
      setPubConferences(updated);
      localStorage.setItem('abinash_pub_conferences', JSON.stringify(updated));
    } else if (category === 'underReview') {
      const updated = [...pubUnderReview];
      updated[index] = { ...updated[index], doi: doiInput };
      setPubUnderReview(updated);
      localStorage.setItem('abinash_pub_under_review', JSON.stringify(updated));
    } else if (category === 'underPreparation') {
      const updated = [...pubPreparation];
      updated[index] = { ...updated[index], doi: doiInput };
      setPubPreparation(updated);
      localStorage.setItem('abinash_pub_preparation', JSON.stringify(updated));
    }

    setIsEditingDoi(false);
    setEditingPubTarget(null);
  };

  const handleEditContent = (path: string, value: string, title: string, type: 'text' | 'textarea' | 'image' = 'text') => {
    if (!isOwner) return;
    setEditingContent({ path, value, title, type });
    setIsEditingContent(true);
  };

  const saveContentUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent || !siteData) return;

    const newData = { ...siteData };
    const keys = editingContent.path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = editingContent.value;

    setSiteData(newData);
    localStorage.setItem('abinash_site_data', JSON.stringify(newData));
    setIsEditingContent(false);
    setEditingContent(null);
  };

  const EditableText = ({ path, title, type = 'text', children, className = "" }: { path: string, title: string, type?: 'text' | 'textarea', children: React.ReactNode, className?: string }) => {
    if (!siteData) return <>{children}</>;
    
    // Resolve value from siteData
    const value = path.split('.').reduce((obj, key) => obj?.[key], siteData);
    
    return (
      <div 
        className={`relative group/editable ${isOwner ? 'cursor-edit hover:bg-brand-accent/5 rounded transition-all duration-300' : ''} ${className}`}
        onClick={() => isOwner && handleEditContent(path, value, title, type)}
      >
        {children}
        {isOwner && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover/editable:opacity-100 transition-opacity bg-brand-accent text-white p-1 rounded-full shadow-lg z-10 scale-0 group-hover/editable:scale-100 duration-200 pointer-events-none">
            <Edit3 size={10} />
          </div>
        )}
      </div>
    );
  };

  const EditableImage = ({ path, title, children, className = "" }: { path: string, title: string, children: React.ReactNode, className?: string }) => {
    if (!siteData) return <>{children}</>;
    const value = path.split('.').reduce((obj, key) => obj?.[key], siteData);

    return (
      <div 
        className={`relative group/editable ${isOwner ? 'cursor-edit' : ''} ${className}`}
        onClick={() => isOwner && handleEditContent(path, value, title, 'image')}
      >
        {children}
        {isOwner && (
          <div className="absolute inset-0 bg-brand-accent/20 opacity-0 group-hover/editable:opacity-100 transition-all flex items-center justify-center rounded-inherit overflow-hidden">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-2 transform translate-y-4 group-hover/editable:translate-y-0 transition-transform">
              <Camera size={14} className="text-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Change Image URL</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const saveGalleryUpdate = () => {
    if (editingGalleryIndex !== null) {
      setGalleryItems(prev => {
        const updated = [...prev];
        updated[editingGalleryIndex] = { 
          ...updated[editingGalleryIndex], 
          title: editGalleryData.title, 
          label: editGalleryData.label 
        };
        localStorage.setItem('abinash_gallery_items', JSON.stringify(updated));
        return updated;
      });
    }
    setIsEditingGalleryItem(false);
    setEditingGalleryIndex(null);
  };

  const removeResearchInterest = (index: number) => {
    const updated = researchInterestsState.filter((_, i) => i !== index);
    setResearchInterestsState(updated);
    localStorage.setItem('abinash_research_interests', JSON.stringify(updated));
  };

  const addResearchInterest = () => {
    setResearchForm({ title: '', description: '' });
    setIsAddingResearch(true);
  };

  const saveResearchInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (researchForm.title && researchForm.description) {
      const newItem = {
        id: `custom-${Date.now()}`,
        visualId: 'petrophysics',
        title: researchForm.title,
        description: researchForm.description,
        keywords: ["Research", "New"],
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200"
      };
      const updated = [...researchInterestsState, newItem];
      setResearchInterestsState(updated);
      localStorage.setItem('abinash_research_interests', JSON.stringify(updated));
      setIsAddingResearch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* MIT PEC LAB INSPIRED HERO HEADER */}
      <header className="fixed top-0 left-0 right-0 z-0 h-[65vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden bg-black group/header">
        {/* Background Image - Absolute Positioning with maximum visibility */}
        <div className="absolute inset-0 z-0 bg-black">
          <EditableImage path="personal.headerImage" title="Header Background URL" className="w-full h-full">
            <img 
              src={headerImgs[0] || siteData?.personal?.headerImage || personal.headerImage} 
              className="w-full h-full object-cover opacity-100" 
              alt="Research Banner" 
              referrerPolicy="no-referrer"
              style={{ imageRendering: 'auto' }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('/lab_wille.png')) {
                  img.src = "/lab_wille.png";
                }
              }}
            />
          </EditableImage>
        </div>

        {/* Dynamic Shadow Gradients for Contrast only where text exists */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>

        {/* Top Branding Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-white">
            <EditableText path="personal.school" title="Navigation Header">
              <div className="flex items-center gap-3">
                <div className="w-1 h-3 bg-brand-accent"></div>
                <span className="font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase text-white/80">{siteData?.personal?.school || personal.school || "OSU | ERDL_IITK"}</span>
              </div>
            </EditableText>
            <div className="flex items-center gap-2">
              {isOwner && (
                <button 
                  onClick={() => headerFileInputRef.current?.click()}
                  className="p-1.5 px-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all flex items-center gap-2 group/btn"
                  title="Update Personal Banner"
                >
                  <Camera size={14} className="group-hover/btn:scale-110 transition-transform"/>
                  <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Change Scene</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content - Professional Alignment */}
        <div className="relative z-50 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="space-y-6">
                <EditableText path="personal.title" title="Hero Job Title">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-[2px] w-12 bg-brand-accent"></div>
                    <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.5em] px-1 whitespace-nowrap drop-shadow-md">
                      {siteData?.personal?.title || "Post-Doctoral Researcher"}
                    </span>
                  </div>
                </EditableText>
 
                <EditableText path="personal.name" title="Hero Name">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight font-serif leading-[0.95] drop-shadow-2xl">
                    {siteData?.personal?.name || "Abinash Bal, Ph.D."}
                  </h1>
                </EditableText>
 
                <EditableText path="personal.subtitle" title="Hero Subtitle">
                  <div className="mt-4 max-w-5xl">
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/95 font-medium tracking-wide drop-shadow-md leading-relaxed italic whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
                      {siteData?.personal?.subtitle || "Pioneering the Future of Subsurface Energy & Carbon Sequestration"}
                    </p>
                  </div>
                </EditableText>
            </div>
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

      {/* Main Content Area */}
      <div className="relative z-20 bg-[#fafafa] w-full min-h-screen mt-[50vh] sm:mt-[40vh] md:mt-[45vh] lg:mt-[55vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-16 pt-12">
      
      {/* LEFT SIDEBAR - Persistent profile & nav */}
      <aside className="w-full md:w-64 lg:w-80 h-auto md:h-screen md:sticky md:top-16 py-8 md:py-20 flex flex-col gap-8 md:overflow-y-auto no-scrollbar bg-[#fafafa]">
        
        {/* Profile Card */}
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-48 sm:w-56 md:w-full aspect-[4/5] rounded-2xl bg-brand-sidebar border border-brand-border flex items-center justify-center text-3xl font-serif italic text-brand-accent overflow-hidden relative group shrink-0">
            <EditableImage path="personal.profileImage" title="Profile Image URL" className="w-full h-full">
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
                  {(siteData?.personal?.name || personal.name || "A B").split(' ')[0]?.[0]}
                  {(siteData?.personal?.name || personal.name || "A B").split(' ')[1]?.[0]}
                </span>
              )}
            </EditableImage>

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
          </div>
        </div>
        <div>
            <EditableText path="personal.name" title="Sidebar Name">
              <h1 className="text-2xl font-bold leading-tight">{siteData?.personal?.name || personal.name}</h1>
            </EditableText>
            <EditableText path="personal.title" title="Sidebar Tagline">
              <p className="text-sm text-brand-muted mt-1 leading-relaxed">{siteData?.personal?.title || personal.title}</p>
            </EditableText>
            <EditableText path="personal.subtitle" title="Sidebar Subtitle">
              <p className="text-xs text-brand-muted font-medium mt-0.5">{siteData?.personal?.subtitle || personal.subtitle}</p>
            </EditableText>
          </div>

        {/* Contact & Links */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted/70 block">Contact</span>
            <div className="space-y-1">
              <EditableText path="personal.email" title="Primary Email">
                <a href={`mailto:${siteData?.personal?.email || personal.email}`} className="sidebar-link truncate">
                  <Mail size={14} className="shrink-0" /> {siteData?.personal?.email || personal.email}
                </a>
              </EditableText>
              <EditableText path="personal.secondaryEmail" title="Secondary Email">
                <a href={`mailto:${siteData?.personal?.secondaryEmail || "bal.abinash@gmail.com"}`} className="sidebar-link truncate">
                  <Mail size={14} className="shrink-0" /> {siteData?.personal?.secondaryEmail || "bal.abinash@gmail.com"}
                </a>
              </EditableText>
              <EditableText path="personal.location" title="Campus Location">
                <div className="sidebar-link">
                  <MapPin size={14} className="shrink-0" /> {siteData?.personal?.location || personal.location}
                </div>
              </EditableText>
              <EditableText path="personal.googleScholar" title="Google Scholar URL">
                <a href={siteData?.personal?.googleScholar || personal.googleScholar} target="_blank" rel="noreferrer" className="sidebar-link">
                  <Globe size={14} className="shrink-0" /> Google Scholar
                </a>
              </EditableText>
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
          
          {isOwner && currentUser && (
            <div className="p-3 bg-brand-accent/5 border border-brand-accent/20 rounded-xl">
               <div className="flex items-center justify-between text-brand-accent mb-2">
                 <div className="flex items-center gap-2">
                   < ShieldCheck size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Owner: {currentUser.email?.split('@')[0]}</span>
                 </div>
                 <button onClick={handleLogout} className="text-[9px] hover:underline flex items-center gap-1">
                   <LogOut size={10} /> Exit
                 </button>
               </div>
               <div className="flex flex-col gap-2">
                 <p className="text-[9px] text-brand-muted leading-tight border-l border-brand-accent/30 pl-2">Authenticated as the lab administrator. All administrative tools are now active.</p>
                 <button 
                   onClick={() => {
                     if(window.confirm("Reset all custom edits to original research data?")) {
                       localStorage.removeItem('abinash_gallery_items');
                       localStorage.removeItem('abinash_timeline_items');
                       localStorage.removeItem('abinash_achievement_items');
                       localStorage.removeItem('abinash_pub_articles');
                       localStorage.removeItem('abinash_pub_conferences');
                       localStorage.removeItem('abinash_pub_under_review');
                       localStorage.removeItem('abinash_pub_preparation');
                       localStorage.removeItem('abinash_site_data');
                       window.location.reload();
                     }
                   }}
                   className="text-[9px] text-brand-accent font-bold uppercase hover:underline text-left mt-2 flex items-center gap-1"
                 >
                   <Trash2 size={10} /> Factory Reset Edits
                 </button>
               </div>
            </div>
          )}

          {!isOwner && (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-muted/40 hover:text-brand-accent transition-all mt-4 group border border-dashed border-brand-border/40 p-2 rounded-lg hover:border-brand-accent/40 w-full"
            >
              <Lock size={14} className="group-hover:rotate-12 transition-transform" /> Owner Access Login
            </button>
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
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTimelineItem(i);
                            }} 
                            className="text-[9px] text-red-500 font-bold uppercase mt-1 hover:underline cursor-pointer bg-red-50/50 px-2 py-0.5 rounded-md border border-red-100/50"
                          >
                            Remove
                          </button>
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
                  <li className="text-[11px] leading-relaxed text-slate-700 font-medium">
                    <EditableText path="adverts.collaboration" title="Collab Opportunity" type="textarea">
                      <span className="font-bold text-amber-600 block mb-1">Research Collaboration:</span>
                      {siteData?.adverts?.collaboration || "As a Postdoctoral Researcher at OSU, I am actively looking for multidisciplinary collaborations in multiscale characterization of saline formations and digital rock physics applications for CCUS."}
                    </EditableText>
                  </li>
                  <li className="text-[11px] leading-relaxed text-slate-700 font-medium">
                    <EditableText path="adverts.industry" title="Industry Opportunity" type="textarea">
                      <span className="font-bold text-amber-600 block mb-1">Industry Partnerships:</span>
                      {siteData?.adverts?.industry || "Seeking partnerships for field-scale validation of experimental pore-network models and carbon storage feasibility studies."}
                    </EditableText>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        <motion.section {...sectionFadeIn} id="about" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-6">Introduction</h2>
          <div className="space-y-6">
            <EditableText path="personal.researchPhilosophy" title="Research Philosophy" type="textarea">
              <p className="text-xl leading-relaxed text-slate-800 italic font-serif">
                 "{siteData?.personal?.researchPhilosophy || personal.researchPhilosophy}"
              </p>
            </EditableText>
            <EditableText path="personal.longTermGoal" title="Long Term Goal" type="textarea">
              <p className="text-brand-muted leading-relaxed">
                {siteData?.personal?.longTermGoal || personal.longTermGoal}
              </p>
            </EditableText>
          </div>
        </motion.section>



        <motion.section {...sectionFadeIn} id="research" className="content-section scroll-mt-32">
          <div className="flex flex-col gap-2 mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 sm:w-12 bg-brand-accent"></div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent">Scientific Investigations</span>
              </div>
              {isOwner && (
                <button 
                  onClick={addResearchInterest}
                  className="px-3 py-1 bg-brand-accent/5 border border-brand-accent/20 rounded-lg text-[9px] font-bold uppercase text-brand-accent hover:bg-brand-accent hover:text-white transition-all flex items-center gap-1"
                >
                  <Plus size={12} /> Add Focus
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 pl-11 sm:pl-15">Research Focus</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {researchInterestsState.map((interest: any, i: number) => {
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
                  className="group relative perspective-1000 cursor-pointer h-full"
                  onClick={() => setSelectedInterest(interest)}
                >
                  <div className="relative h-full bg-white rounded-[2rem] border border-brand-border p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-brand-accent/40 min-h-[14rem]">
                    
                    {/* Technical Layer Background */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      <div className="absolute top-0 right-0 w-48 h-48 -mr-8 -mt-8 opacity-[0.08] group-hover:opacity-[0.2] transition-all duration-700 rotate-12 group-hover:rotate-0 scale-125 group-hover:scale-[1.5] text-brand-accent filter blur-[0.5px]">
                        <VisualComponent />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                    </div>

                    {/* Bottom Content: Info */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <EditableText path={`researchInterests.${i}.title`} title="Interest Title">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-accent transition-colors tracking-tight leading-tight">
                            {interest.title}
                          </h4>
                        </EditableText>
                        {isOwner && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeResearchInterest(i); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {interest.keywords?.map((k: string, ki: number) => (
                          <span key={ki} className="text-[9px] sm:text-[10px] font-semibold text-brand-accent/80 border border-brand-accent/20 px-2 py-0.5 rounded-full bg-brand-accent/5 group-hover:bg-brand-accent/10 transition-all">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Corner Indicators */}
                    <div className="absolute bottom-4 left-8 text-[6px] font-mono text-slate-300 tracking-tighter group-hover:text-brand-accent/30 transition-colors uppercase">
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
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-accent mb-8 flex items-center gap-4">
            <span className="w-12 h-[2px] bg-brand-accent/20"></span>
            Professional Path
          </h2>
          <div className="space-y-8">
            {(siteData?.experience || experience).map((exp: any, i: number) => (
              <div key={i} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <EditableText path={`experience.${i}.role`} title="Professional Role">
                    <h3 className="text-xl font-bold group-hover:text-brand-accent transition-colors">{exp.role}</h3>
                  </EditableText>
                  <EditableText path={`experience.${i}.period`} title="Timeline Period">
                    <span className="text-[10px] font-mono text-brand-muted shrink-0 ml-4">{exp.period}</span>
                  </EditableText>
                </div>
                <EditableText path={`experience.${i}.organization`} title="Organization/University">
                  <p className="text-sm text-brand-muted font-bold tracking-widest uppercase mb-3">{exp.organization}</p>
                </EditableText>
                <EditableText path={`experience.${i}.description`} title="Role Description" type="textarea">
                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{exp.description}</p>
                </EditableText>
                {exp.advisor && (
                  <EditableText path={`experience.${i}.advisor`} title="Supervisor/Advisor">
                    <p className="text-xs italic text-brand-muted mt-2">Supervised by {exp.advisor}</p>
                  </EditableText>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="dossier" className="content-section scroll-mt-32">
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-accent mb-8 flex items-center gap-4">
            <span className="w-12 h-[2px] bg-brand-accent/20"></span>
            Academic Dossier
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {(siteData?.education || education).map((edu: any, i: number) => (
               <div key={i}>
                 <EditableText path={`education.${i}.year`} title="Graduation Year">
                   <span className="text-[10px] font-mono text-brand-muted block mb-1">{edu.year}</span>
                 </EditableText>
                 <EditableText path={`education.${i}.degree`} title="Academic Degree">
                   <h4 className="text-base font-bold mb-1 leading-tight">{edu.degree}</h4>
                 </EditableText>
                 <EditableText path={`education.${i}.institution`} title="Academic Institution">
                   <p className="text-xs text-brand-muted uppercase tracking-wider font-bold mb-1">{edu.institution}</p>
                 </EditableText>
                 <EditableText path={`education.${i}.details`} title="Thesis/Project Details" type="textarea">
                   <p className="text-[10px] text-slate-400 italic">{edu.details}</p>
                 </EditableText>
               </div>
             ))}
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} className="content-section">
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-accent mb-8 flex items-center gap-4">
            <span className="w-12 h-[2px] bg-brand-accent/20"></span>
            Technical Mastery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
                Analytical Instrumentation
              </h4>
              <EditableText path="skills.instrumentation" title="Analytical Mastery" type="textarea">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {siteData?.skills?.instrumentation || skills.instrumentation}
                </p>
              </EditableText>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-brand-muted mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
                Software & Simulation
              </h4>
              <EditableText path="skills.software" title="Computational Mastery" type="textarea">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {siteData?.skills?.software || skills.software}
                </p>
              </EditableText>
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="publications" className="content-section scroll-mt-32">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent mb-8">Publications</h2>
          
          <div className="space-y-16">
            {/* Journal Articles */}
            <div className="space-y-4">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-4">Peer-Reviewed Journal Articles</h4>
               {pubArticles.slice().sort((a,b) => {
                 const yA = parseInt(a.year?.toString().match(/\d+/)?.[0] || '0');
                 const yB = parseInt(b.year?.toString().match(/\d+/)?.[0] || '0');
                 return yB - yA;
               }).map((pub: any, i: number) => (
                 <div key={i} className="publication-card group relative flex gap-4">
                   <div className="text-brand-accent font-mono text-xs mt-1 w-6 shrink-0">{pubArticles.length - i}.</div>
                   <div className="flex flex-col gap-1 flex-1">
                     <h5 className="text-base font-bold leading-snug group-hover:text-brand-accent transition-colors">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)}</p>
                     <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="tag">{pub.journal} {pub.year}</span>
                        {pub.impact && <span className="text-[9px] font-mono text-slate-400">Impact Factor: {pub.impact}</span>}
                        {pub.doi ? (
                          <div className="flex items-center gap-2">
                            <a 
                              href={`https://doi.org/${pub.doi.replace(/^https?:\/\/(www\.)?doi\.org\//, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                            >
                              DOI: {pub.doi}
                              <ExternalLink size={10} />
                            </a>
                            {isOwner && (
                              <button 
                                onClick={() => handleUpdateDoi('journalArticles', i, pub.doi)}
                                className="p-1 hover:bg-brand-accent/10 rounded transition-colors text-brand-accent/60 hover:text-brand-accent"
                                title="Edit DOI"
                              >
                                <Edit3 size={10} />
                              </button>
                            )}
                          </div>
                        ) : (
                          isOwner && (
                            <button 
                              onClick={() => handleUpdateDoi('journalArticles', i, '')}
                              className="text-[9px] font-bold text-brand-muted hover:text-brand-accent flex items-center gap-1 border border-brand-border px-2 py-0.5 rounded-full hover:border-brand-accent transition-all"
                            >
                              <Plus size={10} /> Set DOI
                            </button>
                          )
                        )}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Conference Papers */}
            <div className="space-y-4">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-4">Conference Full Papers</h4>
               {pubConferences.slice().sort((a,b) => {
                 const yA = parseInt(a.year?.toString().match(/\d+/)?.[0] || '0');
                 const yB = parseInt(b.year?.toString().match(/\d+/)?.[0] || '0');
                 return yB - yA;
               }).map((pub: any, i: number) => (
                 <div key={i} className="publication-card group flex gap-4">
                   <div className="text-brand-accent font-mono text-xs mt-1 w-6 shrink-0">{pubConferences.length - i}.</div>
                   <div className="flex flex-col gap-1 flex-1">
                     <h5 className="text-base font-bold leading-snug group-hover:text-brand-accent transition-colors">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)} ({pub.year})</p>
                     <div className="flex items-center gap-3 mt-1 flex-wrap">
                       <p className="text-[10px] text-brand-muted font-medium uppercase tracking-tighter italic">{pub.conference}</p>
                       {pub.doi ? (
                         <div className="flex items-center gap-2">
                           <a 
                             href={`https://doi.org/${pub.doi.replace(/^https?:\/\/(www\.)?doi\.org\//, '')}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[9px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                           >
                             DOI: {pub.doi}
                             <ExternalLink size={10} />
                           </a>
                           {isOwner && (
                             <button 
                               onClick={() => handleUpdateDoi('conferencePapers', i, pub.doi)}
                               className="p-1 hover:bg-brand-accent/10 rounded transition-colors text-brand-accent/60 hover:text-brand-accent"
                             >
                               <Edit3 size={10} />
                             </button>
                           )}
                         </div>
                       ) : (
                         isOwner && (
                           <button 
                             onClick={() => handleUpdateDoi('conferencePapers', i, '')}
                             className="text-[9px] font-bold text-brand-muted hover:text-brand-accent flex items-center gap-1 border border-brand-border px-2 py-0.5 rounded-full hover:border-brand-accent transition-all"
                           >
                             <Plus size={10} /> Set DOI
                           </button>
                         )
                       )}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Under Review */}
            <div className="space-y-4">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-4">Manuscripts Under Review</h4>
               {pubUnderReview.map((pub: any, i: number) => (
                 <div key={i} className="publication-card group border-l-2 border-l-brand-accent/30 pl-4 flex gap-4">
                   <div className="text-brand-accent font-mono text-xs mt-1 w-6 shrink-0">{pubUnderReview.length - i}.</div>
                   <div className="flex flex-col gap-1 flex-1">
                     <h5 className="text-base font-medium leading-snug italic text-slate-700">{pub.title}</h5>
                     <p className="text-xs text-brand-muted">{formatAuthors(pub.authors)}</p>
                     <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="tag bg-brand-sidebar">{pub.journal}</span>
                        <span className="text-[9px] font-mono text-brand-accent uppercase font-bold">{pub.status}</span>
                        {pub.doi ? (
                          <div className="flex items-center gap-2">
                            <a 
                              href={`https://doi.org/${pub.doi.replace(/^https?:\/\/(www\.)?doi\.org\//, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                            >
                              DOI: {pub.doi}
                              <ExternalLink size={10} />
                            </a>
                            {isOwner && (
                              <button 
                                onClick={() => handleUpdateDoi('underReview', i, pub.doi)}
                                className="p-1 hover:bg-brand-accent/10 rounded transition-colors text-brand-accent/60 hover:text-brand-accent"
                              >
                                <Edit3 size={10} />
                              </button>
                            )}
                          </div>
                        ) : (
                          isOwner && (
                            <button 
                              onClick={() => handleUpdateDoi('underReview', i, '')}
                              className="text-[9px] font-bold text-brand-muted hover:text-brand-accent flex items-center gap-1 border border-brand-border px-2 py-0.5 rounded-full hover:border-brand-accent transition-all"
                            >
                              <Plus size={10} /> Set DOI
                            </button>
                          )
                        )}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Under Preparation */}
            <div className="space-y-4">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-4">Manuscripts Under Preparation</h4>
               {pubPreparation.map((pub: any, i: number) => (
                 <div key={i} className="py-3 border-b border-brand-border/30 last:border-0 opacity-75 group relative flex gap-4">
                   <div className="text-brand-accent font-mono text-xs mt-1 w-6 shrink-0">{pubPreparation.length - i}.</div>
                   <div className="flex-1">
                    <h5 className="text-sm font-medium leading-snug text-slate-600">{pub.title}</h5>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-brand-muted">{formatAuthors(pub.authors)}</p>
                      {pub.doi ? (
                          <div className="flex items-center gap-2">
                            <a 
                              href={`https://doi.org/${pub.doi.replace(/^https?:\/\/(www\.)?doi\.org\//, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                            >
                              DOI: {pub.doi}
                              <ExternalLink size={10} />
                            </a>
                            {isOwner && (
                              <button 
                                onClick={() => handleUpdateDoi('underPreparation', i, pub.doi)}
                                className="p-1 hover:bg-brand-accent/10 rounded transition-colors text-brand-accent/60 hover:text-brand-accent"
                              >
                                <Edit3 size={10} />
                              </button>
                            )}
                          </div>
                      ) : (
                        isOwner && (
                          <button 
                            onClick={() => handleUpdateDoi('underPreparation', i, '')}
                            className="text-[9px] font-bold text-brand-muted hover:text-brand-accent flex items-center gap-1 border border-brand-border px-2 py-0.5 rounded-full hover:border-brand-accent transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Plus size={10} /> Set DOI
                          </button>
                        )
                      )}
                    </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionFadeIn} id="awards" className="content-section scroll-mt-32">
          <div className="flex flex-row justify-between items-center mb-8">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent">Major Achievements & Honors</h2>
            {isOwner && (
              <button 
                onClick={addAchievementItem} 
                className="px-3 py-1 bg-brand-accent/5 border border-brand-accent/20 rounded-lg text-[9px] font-bold uppercase text-brand-accent hover:bg-brand-accent hover:text-white transition-all flex items-center gap-1"
              >
                <Plus size={12} /> Add Achievement
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
             {achievementItems.map((item: any, i: number) => (
               <div key={i} className="p-6 md:p-8 bg-white border border-brand-border rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent opacity-20 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex justify-between items-start mb-4">
                   <EditableText path={`awards.${i}.year`} title="Achievement Year">
                     <div className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[9px] font-bold rounded-lg uppercase tracking-wider">{item.year}</div>
                   </EditableText>
                   {isOwner && (
                     <button 
                        onClick={() => removeAchievementItem(i)} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm cursor-pointer"
                        title="Remove achievement"
                     >
                        <Trash2 size={14} />
                     </button>
                   )}
                 </div>
                 <EditableText path={`awards.${i}.title`} title="Achievement Title">
                   <h4 className="text-sm font-bold text-slate-800 mb-2 leading-tight group-hover:text-brand-accent transition-colors">{item.title}</h4>
                 </EditableText>
                 <EditableText path={`awards.${i}.details`} title="Achievement Details" type="textarea">
                   <p className="text-[10px] text-brand-muted leading-relaxed italic pr-8">{item.details}</p>
                 </EditableText>
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

        <motion.section {...sectionFadeIn} className="content-section mb-24 scroll-mt-32" id="gallery">
          <div className="flex justify-between items-center mb-10">
            <div>
              <EditableText path="gallery.headerTitle" title="Gallery Section Title">
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-accent">{siteData?.gallery?.headerTitle || "Laboratory & Fieldwork"}</h2>
              </EditableText>
              <EditableText path="gallery.headerDescription" title="Gallery Section Description" type="textarea">
                <p className="text-[11px] text-brand-muted mt-2 max-w-lg">{siteData?.gallery?.headerDescription || "Advanced experimental setups, specialized core analysis systems, and imaging facilities driving our multiscale investigations."}</p>
              </EditableText>
            </div>
            {isOwner && (
              <div className="flex gap-3">
                {galleryItems.length > 0 && (
                  <button 
                    onClick={clearGallery}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-[10px] uppercase font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                )}
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
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <SortableContext 
                items={galleryItems.map((item, i) => item.id || `gallery-${i}`)}
                strategy={rectSortingStrategy}
              >
                {galleryItems.map((item, i) => (
                  <GalleryCard 
                    key={item.id || `gallery-${i}`} 
                    item={item} 
                    i={i} 
                    isOwner={isOwner}
                    removeGalleryItem={removeGalleryItem}
                    updateGalleryItem={updateGalleryItem}
                    galleryFileInputRef={galleryFileInputRef}
                  />
                ))}
              </SortableContext>
              
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
          </DndContext>
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
                <div className="bg-slate-900 border border-brand-border rounded-3xl aspect-video sm:aspect-square flex items-center justify-center relative overflow-hidden group shadow-inner">
                  {selectedInterest.videoUrl ? (
                    <video 
                      key={selectedInterest.id}
                      autoPlay 
                      muted 
                      loop 
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    >
                      <source src={selectedInterest.videoUrl} type="video/mp4" />
                    </video>
                  ) : (selectedInterest.imageUrl && !selectedInterest.imageUrl.includes('photo-1581091226825-a6a2a5aee158')) && (
                    <img 
                      src={selectedInterest.imageUrl} 
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                      alt={selectedInterest.title}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                  
                  <div className="w-full h-full max-w-[200px] sm:max-w-[300px] flex items-center justify-center relative z-10 text-white/80 group-hover:text-white transition-colors drop-shadow-2xl">
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
                  <EditableText 
                    path={`researchInterests.${researchInterestsState.findIndex(ri => ri.title === selectedInterest.title)}.description`} 
                    title="Focus Methodology" 
                    type="textarea"
                  >
                    <p className="text-xl font-serif italic text-slate-700 leading-relaxed border-l-4 border-brand-accent/20 pl-6">
                      {selectedInterest.description}
                    </p>
                  </EditableText>
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
                <a 
                  href={cvUrl?.startsWith('data:') ? blobUrl || '' : cvUrl || ''} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-brand-accent flex items-center gap-2"
                  title="Open in New Tab"
                >
                  <ExternalLink size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Open Direct</span>
                </a>
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
              {(blobUrl || cvUrl) ? (
                <div className="w-full h-full flex flex-col bg-white">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck size={14} className="text-brand-accent" /> 
                       Verified Document Viewer
                    </span>
                    <div className="flex gap-4">
                      <a 
                        href={blobUrl || cvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                      >
                        NEW TAB <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  <object 
                    data={`${blobUrl || cvUrl}#view=FitH`} 
                    type="application/pdf" 
                    className="w-full h-full border-none"
                    style={{ minHeight: 'calc(100vh - 120px)' }}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                      <FileText size={48} className="text-brand-accent mb-4 opacity-20" />
                      <h3 className="text-lg font-bold mb-2">PDF Preview Unavailable</h3>
                      <p className="text-sm text-brand-muted max-w-md mb-6">
                        Your browser or security settings are preventing the embedded PDF viewer from loading. You can still download the file to view it.
                      </p>
                      <a 
                        href={blobUrl || cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
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
                            setCvLinkInput(cvExternalUrl || "");
                            setIsEditingCvLink(true);
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

      {/* Gallery Edit Modal */}
      <AnimatePresence>
        {isEditingGalleryItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsEditingGalleryItem(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Research Asset</span>
                  <h3 className="text-xl font-bold text-slate-900">Edit Documentation</h3>
                </div>
                <button 
                  onClick={() => setIsEditingGalleryItem(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Image/Video Title</label>
                  <input 
                    type="text" 
                    value={editGalleryData.title}
                    onChange={(e) => setEditGalleryData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Micro-CT Visualization"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Description / Label</label>
                  <textarea 
                    value={editGalleryData.label}
                    onChange={(e) => setEditGalleryData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Briefly describe what this asset represents..."
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all resize-none text-sm leading-relaxed"
                  />
                </div>
              </div>
              
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsEditingGalleryItem(false)}
                  className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Dismiss
                </button>
                <button 
                  onClick={saveGalleryUpdate}
                  className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Save Documentation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Research Interest Modal */}
      <AnimatePresence>
        {isAddingResearch && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsAddingResearch(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={saveResearchInterest}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Focus Area</span>
                    <h3 className="text-xl font-bold text-slate-900">Add Research Interest</h3>
                  </div>
                  <button type="button" onClick={() => setIsAddingResearch(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Research Title</label>
                    <input 
                      required
                      type="text" 
                      value={researchForm.title}
                      onChange={(e) => setResearchForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Subsurface Hydrology"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Detailed Description</label>
                    <textarea 
                      required
                      value={researchForm.description}
                      onChange={(e) => setResearchForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the research scope and objectives..."
                      rows={4}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all resize-none text-sm leading-relaxed"
                    />
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsAddingResearch(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Dismiss</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Add Research Area</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Timeline Modal */}
      <AnimatePresence>
        {isAddingTimeline && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsAddingTimeline(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={saveTimelineItem}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Announcements</span>
                    <h3 className="text-xl font-bold text-slate-900">New Achievement/Post</h3>
                  </div>
                  <button type="button" onClick={() => setIsAddingTimeline(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Date</label>
                    <input 
                      required
                      type="text" 
                      value={timelineForm.date}
                      onChange={(e) => setTimelineForm(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="e.g. May 2025"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Announcement Text</label>
                    <textarea 
                      required
                      value={timelineForm.text}
                      onChange={(e) => setTimelineForm(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Describe what happened..."
                      rows={3}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all resize-none text-sm leading-relaxed"
                    />
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsAddingTimeline(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Dismiss</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Post Announcement</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Achievement Modal */}
      <AnimatePresence>
        {isAddingAchievement && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsAddingAchievement(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={saveAchievementItem}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Honors & Awards</span>
                    <h3 className="text-xl font-bold text-slate-900">Add Achievement</h3>
                  </div>
                  <button type="button" onClick={() => setIsAddingAchievement(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Year</label>
                      <input 
                        required
                        type="text" 
                        value={achievementForm.year}
                        onChange={(e) => setAchievementForm(prev => ({ ...prev, year: e.target.value }))}
                        placeholder="2024"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Award Title</label>
                      <input 
                        required
                        type="text" 
                        value={achievementForm.title}
                        onChange={(e) => setAchievementForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Best Thesis Award"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Details / Grantor</label>
                    <textarea 
                      value={achievementForm.details}
                      onChange={(e) => setAchievementForm(prev => ({ ...prev, details: e.target.value }))}
                      placeholder="Conferred by IIT Kanpur..."
                      rows={2}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all resize-none text-sm leading-relaxed"
                    />
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsAddingAchievement(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Dismiss</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Save Achievement</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Gallery Item Modal */}
      <AnimatePresence>
        {isAddingGallery && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsAddingGallery(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={saveGalleryNewItem}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Upload Complete</span>
                    <h3 className="text-xl font-bold text-slate-900">Define Media Entry</h3>
                  </div>
                  <button type="button" onClick={() => setIsAddingGallery(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                      {galleryUploadForm.type === 'video' ? (
                        <video src={galleryUploadForm.url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                      ) : (
                        <img src={galleryUploadForm.url} className="w-full h-full object-cover" alt="Uploaded preview" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Item Title</label>
                      <input 
                        required
                        type="text" 
                        value={galleryUploadForm.title}
                        onChange={(e) => setGalleryUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Field Investigation"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Label / Details</label>
                      <input 
                        required
                        type="text" 
                        value={galleryUploadForm.label}
                        onChange={(e) => setGalleryUploadForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g. Sampling subsurface materials"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsAddingGallery(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Discard</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Add to Gallery</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CV Link Modal */}
      <AnimatePresence>
        {isEditingCvLink && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsEditingCvLink(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                handleExternalUrlChange(cvLinkInput);
                setIsEditingCvLink(false);
              }}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">External Document</span>
                    <h3 className="text-xl font-bold text-slate-900">Set CV Link</h3>
                  </div>
                  <button type="button" onClick={() => setIsEditingCvLink(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Google Drive / External URL</label>
                    <input 
                      required
                      type="url" 
                      value={cvLinkInput}
                      onChange={(e) => setCvLinkInput(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-400 mt-2 italic px-1 leading-relaxed">
                      This will replace the digital summary with an external link button in your "Professional Bio" section.
                    </p>
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsEditingCvLink(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Dismiss</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Set Live Link</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content Edit Modal */}
      <AnimatePresence>
        {isEditingContent && editingContent && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
              onClick={() => setIsEditingContent(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 relative z-10"
            >
              <form onSubmit={saveContentUpdate}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Content Studio</span>
                    <h3 className="text-xl font-bold text-slate-900">{editingContent.title}</h3>
                  </div>
                  <button type="button" onClick={() => setIsEditingContent(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">
                      {editingContent.type === 'image' ? 'Image Source URL' : 'Content Text'}
                    </label>
                    
                    {editingContent.type === 'textarea' ? (
                      <textarea
                        required
                        value={editingContent.value}
                        onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium min-h-[200px] leading-relaxed"
                        autoFocus
                      />
                    ) : (
                      <input 
                        required
                        type="text" 
                        value={editingContent.value}
                        onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                        autoFocus
                      />
                    )}

                    {editingContent.type === 'image' && editingContent.value && (
                      <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative">
                        <img src={editingContent.value} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/50 backdrop-blur-sm text-[10px] text-white text-center font-mono truncate">
                          Previewing Asset
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 mt-2 italic px-1 leading-relaxed">
                      All changes are saved instantly to your laboratory dataset and will be visible to all visitors.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsEditingContent(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Apply Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOI Edit Modal */}
      <AnimatePresence>
        {isEditingDoi && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsEditingDoi(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative z-10"
            >
              <form onSubmit={saveDoiUpdate}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent mb-2 block">Publication Asset</span>
                    <h3 className="text-xl font-bold text-slate-900">Link Paper (DOI)</h3>
                  </div>
                  <button type="button" onClick={() => setIsEditingDoi(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">DOI Number or Full URL</label>
                    <input 
                      required
                      type="text" 
                      value={doiInput}
                      onChange={(e) => setDoiInput(e.target.value)}
                      placeholder="e.g. 10.1016/j.jrmge..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm font-medium"
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-400 mt-2 italic px-1 leading-relaxed">
                      Entering the DOI number will automatically link this publication to the official publisher's page.
                    </p>
                  </div>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsEditingDoi(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-[1.5] px-6 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10">Save Link</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Reset for Owners */}
      {isOwner && (
        <button 
          onClick={() => {
            if (window.confirm("RESET ALL SITE DATA? This will overwrite everything with defaults. Only use if images are broken.")) {
              setSiteData(CV_DATA);
              setGalleryItems([{ id: 'default-1', title: 'Laboratory Equipment', label: 'Experimental Setup', type: 'image', url: '/lab_wille.png' }]);
              saveAllToServer({ ...CV_DATA, galleryItems: [{ id: 'default-1', title: 'Laboratory Equipment', label: 'Experimental Setup', type: 'image', url: '/lab_wille.png' }] });
              window.location.reload();
            }
          }}
          className="fixed bottom-4 left-4 z-[100] p-2 bg-red-600 text-white text-[8px] font-bold uppercase rounded-lg opacity-20 hover:opacity-100 transition-opacity"
        >
          Reset Data
        </button>
      )}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
              onClick={() => setIsLoginOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20 relative z-10"
            >
              <div className="p-8 pb-4 text-center">
                <div className="w-16 h-16 bg-brand-sidebar rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-border">
                  <ShieldCheck size={32} className={`${isRegisteringMode ? 'text-blue-500' : 'text-brand-accent'}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{isRegisteringMode ? 'Create Owner Account' : 'Owner Access'}</h3>
                <p className="text-sm text-slate-500 mt-2">{isRegisteringMode ? 'Set up administrative access' : 'Enter credentials to unlock editing features'}</p>
              </div>

              <form onSubmit={isRegisteringMode ? handleRegister : handleLogin} className="p-8 pt-4 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm"
                      placeholder="bal.abinash@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">{isRegisteringMode ? 'Set Password' : 'Access Password'}</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium leading-relaxed"
                  >
                    {loginError}
                  </motion.div>
                )}

                {resetStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${resetStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                  >
                    {resetStatus.message}
                  </motion.div>
                )}

                <div className="flex flex-col gap-4 pt-2">
                  <button 
                    disabled={isAuthenticating}
                    type="submit" 
                    className={`w-full py-4 ${isRegisteringMode ? 'bg-blue-600' : 'bg-slate-900'} text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70`}
                  >
                    {isAuthenticating ? <Loader2 className="animate-spin" size={14} /> : (isRegisteringMode ? 'Register Account' : 'Authenticate')}
                  </button>
                  
                  <div className="flex items-center justify-between px-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsRegisteringMode(!isRegisteringMode);
                        setLoginError(null);
                      }}
                      className="text-[10px] font-bold text-brand-accent hover:underline uppercase tracking-widest"
                    >
                      {isRegisteringMode ? 'Back to Login' : 'First time? Create account'}
                    </button>
                    {!isRegisteringMode && (
                      <button 
                        type="button"
                        onClick={handleResetPassword}
                        disabled={isResetSending}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest disabled:opacity-50"
                      >
                        {isResetSending ? 'Sending Link...' : 'Forgot Password?'}
                      </button>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsLoginOpen(false)}
                    className="w-full py-3 text-[10px] font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 text-center leading-relaxed font-medium uppercase tracking-widest">
                  This area is reserved for researchers managing the ERDL laboratory digital twin. Unauthorized access is restricted.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
