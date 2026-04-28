import { BookOpen, Award, GraduationCap, Briefcase, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const CV_DATA = {
  personal: {
    name: "Abinash Bal, Ph.D.",
    title: "Post-Doctoral Researcher",
    subtitle: "Pioneering the Future of Subsurface Energy & Carbon Sequestration",
    location: "Columbus, OH, USA",
    school: "School of Earth Sciences, The Ohio State University",
    email: "bal.47@osu.edu",
    secondaryEmail: "bal.abinash@gmail.com",
    profileImage: "/profile.png",
    // Replace YOUR_ID_HERE with your actual Google Scholar ID
    googleScholar: "https://scholar.google.com/citations?user=M5_ZZp0AAAAJ&hl=en",
    phone: "+1 (614) 330-9430",
    researchPhilosophy: "My research lies at the intersection of Experimental Rock Mechanics and Petrophysics, focusing on the fundamental mechanisms of fluid transport and storage within the intricate nanopore networks of tight reservoir rocks. By bridging the gap between nano-scale observations and meso-scale behaviors, I aim to unlock new frontiers in Sustainable Energy recovery and Carbon Sequestration, pioneering the development of reliable predictive models for the global energy transition.",
    longTermGoal: "In the long term, I aim to lead an academic research program at the interface of rock mechanics, petrophysics, and CCUS, while mentoring the next generation of geoscientists."
  },
  researchInterests: [
    {
      id: "rock-mechanics",
      visualId: "triaxial",
      title: "Experimental Rock Mechanics",
      description: "Characterizing mechanical behavior and pressure-dependent porosity evolution using high-pressure triaxial deformation tests. Focus on stress-strain dynamics in sandstones and limestones, exploring micro-structural failure and compaction localization.",
      keywords: ["Mechanical Behavior", "Triaxial deformation", "Stress-Strain", "Compaction localization"],
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-scientific-process-in-a-laboratory-41221-large.mp4"
    },
    {
      id: "petrophysics",
      visualId: "petrophysics",
      title: "Petrophysics",
      description: "Characterizing physical and chemical properties of reservoir rocks and their interactions with fluids to optimize storage and transport. Focus on porosity-permeability relationships and the influence of mineralogy on fluid-rock surface dynamics.",
      keywords: ["Porosity", "Permeability", "Petrophysical properties", "Mineral-Fluid interaction"],
      imageUrl: "https://images.unsplash.com/photo-1582719501235-97f70b53648e?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "" // Removed the inappropriate placeholder
    },
    {
      id: "digital-rock",
      visualId: "micro-ct",
      title: "Digital Rock Physics",
      description: "Advanced Micro-CT imaging and algorithmic sub-resolution porosity modeling. Investigating non-uniqueness in permeability prediction and quantifying pore-fracture networks in 3D for CCS and reservoir management.",
      keywords: ["Micro-CT", "Pore Network", "Digital Rock Physics", "Sub-resolution porosity"],
      imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-of-a-microscope-showing-the-lenses-41223-large.mp4"
    },
    {
      id: "nanopore",
      visualId: "nanopore",
      title: "Nanopore Characterization",
      description: "Multiscale assessment of shale nanopore heterogeneity using Synchrotron SAXS, FE-SEM, and Low-pressure gas adsorption. Mapping pore families (discretized) and quantifying accessible vs. total nanopore volumes.",
      keywords: ["Synchrotron SAXS", "Nanopore Heterogeneity", "Pore volume", "Accessibility"],
      imageUrl: "https://images.unsplash.com/photo-1579154235602-3c32a76f2ff3?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-analysis-of-a-liquid-in-a-test-tube-in-a-laboratory-41224-large.mp4"
    },
    {
      id: "flow-dynamics",
      visualId: "flow",
      title: "Flow in Porous Media",
      description: "Experimental observation of non-linear fluid flow at the nano-to-meso scale. Decoupling poro-elastic and fluid-dynamic effects, analyzing Klinkenberg slippage, and flow regime transitions in anisotropic shale reservoirs.",
      keywords: ["Fluid Flow", "Klinkenberg effect", "Slippage", "Decoupling poro-elasticity"],
      imageUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-water-flowing-through-a-narrow-channel-42468-large.mp4"
    },
    {
      id: "ccs",
      visualId: "carbon",
      title: "Carbon Sequestration (CCUS)",
      description: "Evaluating deep saline formations and coal seams for safe CO2 storage. Analyzing flow kinetics in dual-porous systems and the concurrent influence of geochemistry and mineralogy on sequestration permanence.",
      keywords: ["Carbon Sequestration", "CO2 storage", "Dual-porosity", "Saline formations"],
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5f9c47e8?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-industrial-complex-releasing-smoke-from-chimneys-41132-large.mp4"
    }
  ],
  experience: [
    {
      period: "Mar 2025 – Present",
      role: "Post-Doctoral Scholar",
      organization: "The Ohio State University, USA",
      description: "Design and run core-analysis programs that measure porosity, permeability, mineralogy, and 3-D pore-fracture networks in candidate CO2-storage reservoirs.",
      advisor: "Prof. David R. Cole"
    },
    {
      period: "June 2024 – Mar 2025",
      role: "Petroleum Geologist",
      organization: "One-Geo, Nashville, USA",
      description: "Interpretation of geological and geochemical data sets. Integration of mass spectrometric geochemical data from mud-gas analysis."
    },
    {
      period: "July 2018 – Sept 2024",
      role: "Doctoral Researcher",
      organization: "IIT Kanpur, India",
      description: "Advancing Shale Energy: A Nano-to-Meso Scale Experimental Investigation to Optimize Storage, Transport and Recovery in Organic-rich Shale.",
      advisor: "Prof. Santanu Misra"
    }
  ],
  education: [
    {
      year: "2024",
      degree: "Ph.D. in Experimental Rock Mechanics and Petrophysics",
      institution: "Indian Institute of Technology Kanpur",
      details: "CPI: 9.29/10"
    },
    {
      year: "2018",
      degree: "M.Sc. in Applied Geology",
      institution: "Indian Institute of Technology Bombay",
      details: "CPI: 9.06/10"
    },
    {
      year: "2015",
      degree: "B.Sc. in Geology Honors",
      institution: "Dharanidhar Autonomous College",
      details: "Aggregate: 90.37%"
    }
  ],
  publications: {
    underReview: [
      {
        authors: "Bal, A., Kumar, A., Misra, S., Cole, D.",
        title: "Sub-Resolution Porosity and Algorithmic Non-Uniqueness: Limits of Micro-CT Digital Rock Physics for Permeability Prediction in Tight Sandstones.",
        journal: "Advances in Water Resources",
        status: "Under Review"
      },
      {
        authors: "Bal, A., Misra, S., Cole, D.",
        title: "Decoupling Poro-elastic and Fluid-dynamic Effects on Apparent Permeability in Unconventional Rocks.",
        journal: "Fuel",
        status: "Under Review"
      }
    ],
    journalArticles: [
      {
        authors: "Saha, P., Dasgupta, A., Bal, A., Misra, S.",
        year: "(2026)",
        title: "Mechanical Behaviour and Pressure-Dependent Porosity Evolution in Porous Sandstone and Limestone Using Triaxial Deformation Tests.",
        journal: "Journal of Rock Mechanics and Geotechnical Engineering",
        impact: "10.2"
      },
      {
        authors: "Mazumder, M., Tripathy, A., Bal, A., Liu, S., Singh, T.N., Pan, Z.",
        year: "(2025)",
        title: "Multi-proxy assessment of thermal and microstructural evolution in sub-bituminous coal affected by igneous intrusion: Implications for CBM storage and transport.",
        journal: "Fuel",
        impact: "7.5"
      },
      {
        authors: "Mazumder, M., Bal, A., Tripathy, A., Mohanty, D., Singh, T.N.",
        year: "(2024)",
        title: "A multiscale assessment of transformation in pore system of shale during combustion: An insight into poromechanical response and sorption dynamics.",
        journal: "Energy & Fuels",
        impact: "5.3"
      },
      {
        authors: "Bal, A., Misra, S.",
        year: "(2024)",
        title: "Laboratory observation of fluid flow in depleted shale gas reservoir: Coupling effect of sorbing and non-sorbing gas on stress, slippage, flow regime in anisotropic and fractured shales.",
        journal: "Energy & Fuels",
        impact: "5.3"
      },
      {
        authors: "Bal, A., Misra, S., Sen, D.",
        year: "(2024)",
        title: "Nanopore heterogeneity and accessibility in oil and gas bearing cretaceous KG (Raghampuram) shale, KG Basin, India: An advanced multi-analytical study.",
        journal: "Natural Resources Research",
        impact: "5.0"
      },
      {
        authors: "Bal, A., Misra, S., Mukherjee, M., Dutta, T.K., Sen, D., Patra, A., Raja, E.",
        year: "(2023)",
        title: "Concurrent influence of geological parameters on the integrated nanopore structure and discretized pore families of the petroliferous Cambay shale assessed through multivariate dependence measure.",
        journal: "Frontiers in Earth Science",
        impact: "2.0"
      },
      {
        authors: "Mukherjee, M., Bal, A., Misra, S.",
        year: "(2021)",
        title: "Role of pore-size distribution in coals to govern the Klinkenberg coefficient and intrinsic permeability.",
        journal: "Energy & Fuels",
        impact: "5.3"
      }
    ],
    conferencePapers: [
      {
        authors: "Bal, A., Misra, S., Sen, D.",
        year: "(2022)",
        title: "Accessible to total nanopore structure and complexity in Cambay shales, India: An implication on storage and transport of hydrocarbon.",
        conference: "ARMA US Rock Mechanics/Geomechanics Symposium",
        doi: "10.56952/ARMA-2022-0653"
      }
    ],
    underPreparation: [
      {
        authors: "Bal, A., Lawal, M., Cook, A., Cole, D.",
        title: "Comparative Evaluation of Deep Saline Formations for CO2 Geological Sequestration in Eastern Ohio."
      },
      {
        authors: "Bal, A., Behera, S., Todkar, T., Misra, S.",
        title: "CO2 flow kinetics in dual-porous anisotropic Jhanjra coal, India: An Implication on Carbon Sequestration."
      }
    ]
  },
  skills: {
    software: "Avizo 2019.1, IGOR Pro, IBM SPSS, X'Pert HighScore Plus, SASfit, Origin 2021b, Adobe Illustrator 2021, ArcGIS, MATSAS (MATLAB), MS Office, Simple CPP, Python",
    instrumentation: "Triaxial Compression, Pulse Decay Permeameter, Pycnometer, Quantachrome Autosorb iQ, Synchrotron SAXS, Mercury Porosimeter, Ultrasonic Pulse Transmission, XRD, Micro-CT, FE-SEM"
  },
  awards: [
    { 
      year: "2025", 
      title: "Postdoctoral Fellowship (Declined)", 
      details: "Offered at KFUPM, Saudi Arabia with a valuation of USD 120,000 for 2 years; declined to pursue current research at OSU." 
    },
    { 
      year: "2023", 
      title: "AGU Student Travel Grant", 
      details: "Competitive grant awarded for presenting research at the American Geophysical Union Fall Meeting." 
    },
    { 
      year: "2023", 
      title: "SERB International Travel Grant", 
      details: "Awarded by the Science and Engineering Research Board, Govt. of India, for attending Euroconf'23 in the Netherlands." 
    },
    { 
      year: "2018 – 2024", 
      title: "MHRD Research Fellowship", 
      details: "Highly selective doctoral fellowship awarded for research excellence in unconventional energy (Total grant: USD 25,000)." 
    },
    { 
      year: "2015", 
      title: "All India Rank 1 (ISM Entrance)", 
      details: "Secured the top rank out of 3,000 applicants in the Indian School of Mines Petroleum Engineering entry exam." 
    },
    { 
      year: "2018", 
      title: "Class of 1968 Creative Research Award", 
      details: "Recognized for innovative doctoral research proposal focus on multiscale shale characterization at IIT Kanpur." 
    },
    { 
      year: "2011", 
      title: "Top 0.001% National Rank (OJEE)", 
      details: "Secured Rank 732 out of 650,000 applicants in the Odisha Joint Entrance Examination." 
    },
    { 
      year: "2015", 
      title: "Top 1% Rank (IIT-JAM)", 
      details: "Ranked 21st nationally in the Joint Admission Test for M.Sc. among 5,000 candidates." 
    }
  ],
  memberships: [
    "American Geophysical Union (AGU)",
    "European Association of Geoscientists and Engineers (EAGE)",
    "Society of Exploration Geophysicists (SEG)",
    "American Association of Petroleum Geologists (AAPG)"
  ],
  reviewing: [
    "Geoenergy Science and Engineering",
    "ACS Omega",
    "Journal of Earth System Science",
    "Natural Resources Research",
    "Petroleum Science and Technology",
    "Nature Scientific Report"
  ]
};
