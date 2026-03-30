/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Headphones, 
  Watch, 
  Speaker, 
  ShieldCheck, 
  Zap, 
  Usb, 
  Camera, 
  Lightbulb, 
  Glasses, 
  Phone, 
  MessageCircle, 
  ShoppingBag,
  ChevronRight,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  Search,
  Sun,
  Plus,
  Trash2,
  LogOut,
  LogIn,
  Package,
  Image as ImageIcon,
  Tag,
  Info,
  DollarSign,
  Shield,
  Truck,
  Eye,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

// --- Constants ---
const CONTACT_PHONE = "+221776861157";
const WHATSAPP_LINK = `https://wa.me/${CONTACT_PHONE.replace('+', '')}`;

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: 'accessoires' | 'optique';
  subCategory: string;
  image: string;
  price?: string;
  description: string;
}

// --- Data ---
const PRODUCTS: Product[] = [
  {
    id: 'tws-pro-5s',
    name: 'Écouteurs sans fil TWS Pro 5S',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://www.manojia.com/wp-content/uploads/2024/02/CASQUE-BLUETOOTH-EARBUD-ECOUTEUR-SANS-FIL-TWS-PRO-5S-NOIR-1.png',
    description: 'Écouteurs Bluetooth haute performance avec étui de charge compact et son cristallin.',
  },
  {
    id: 'beats-studio3-red',
    name: 'Beats Studio3 Sans Fil - Rouge',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://static.fnac-static.com/multimedia/Images/36/36/59/5D/6117686-3-1541-1/tsp20240916110822/Casque-a-reduction-de-bruit-Beats-Studio3-Rouge.jpg',
    description: 'Casque à réduction de bruit active pour une immersion totale et un confort exceptionnel.',
  },
  {
    id: 'smartwatch-premium',
    name: 'Montre Connectée Premium',
    category: 'accessoires',
    subCategory: 'Gadgets',
    image: 'https://media.lesechos.com/api/v1/images/view/614ab5148fe56f02d0730d43/1280x720/0611732698255-web-tete.jpg',
    description: 'Suivez votre santé et restez connecté avec style grâce à cette montre intelligente de dernière génération.',
  },
  {
    id: 'jbl-charge-3',
    name: 'JBL Charge 3 - Enceinte Bluetooth',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://static.fnac-static.com/multimedia/Images/FD/Comete/73347/CCP_IMG_1200x800/909756.jpg',
    description: 'Enceinte portable étanche avec une autonomie impressionnante et un son puissant.',
  },
  {
    id: 'iphone-cases-all',
    name: 'Coques de protection iPhone',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://img.lemde.fr/2021/02/15/500/0/6000/3000/1440/720/60/0/a7e778d_584537715-iphonecases2020-fullres-9308.jpg',
    description: 'Ensemble complet de coques de protection pour tous les modèles d\'iPhone.',
  },
  {
    id: 'usb-3in1-cable',
    name: 'Câbles USB 3-en-1',
    category: 'accessoires',
    subCategory: 'Énergie',
    image: 'https://armor-x.com/cdn/shop/files/PWR-CB06-CCM-ARMOR-X-1-2-meter-USB-C-3-in-1-Cable-with-USB-C-Type-C-Micro-USB-Connector-for-Phone_1_1800x1800.jpg?v=1727161617',
    description: 'Câble polyvalent avec connecteurs Lightning, Type-C et Micro-USB.',
  },
  {
    id: 'ring-light-tripod',
    name: 'Ring Light sur Trépied',
    category: 'accessoires',
    subCategory: 'Photo/Vidéo',
    image: 'https://m.media-amazon.com/images/I/61QW9ffX17L._AC_UF1000,1000_QL80_.jpg',
    description: 'Anneau lumineux professionnel sur trépied pour TikTok, photos et vidéos.',
  },
  {
    id: 'classic-watch-collection',
    name: 'Collection Montres Classiques',
    category: 'accessoires',
    subCategory: 'Horlogerie',
    image: 'https://thewatchobserver.ouest-france.fr/wp-content/uploads/2024/12/montre-moins-de-1000-euros-selection.jpg',
    description: 'Modèles à aiguilles élégants pour une allure intemporelle.',
  },
  {
    id: 'corrective-glasses',
    name: 'Lunettes Correctrices',
    category: 'optique',
    subCategory: 'Santé Visuelle',
    image: 'https://www.optic2000.com/media/wysiwyg/POLO-RALPH-LAUREN-PH2233-5958.webp',
    description: 'Montures optiques de qualité pour une vision parfaite.',
  },
  {
    id: 'photogrey-glasses',
    name: 'Lunettes Photogrey',
    category: 'optique',
    subCategory: 'Technologie',
    image: 'https://amzi-group.com/wp-content/uploads/2024/07/Nouveau-projet-27-4.jpg',
    description: 'Verres intelligents qui s\'adaptent automatiquement à la lumière du soleil.',
  },
  {
    id: 'simple-glasses',
    name: 'Lunettes Simples',
    category: 'optique',
    subCategory: 'Style',
    image: 'https://www.coolminiprix.com/155432-large_default/lunettes-de-vue-rectangulaire-simple-mix.jpg',
    description: 'Montures rectangulaires simples et élégantes pour un usage quotidien.',
  },
  {
    id: 'sunglasses-trendy',
    name: 'Lunettes de Soleil Tendance',
    category: 'optique',
    subCategory: 'Protection',
    image: 'https://www.clicandfit.com/blog/wp-content/uploads/2024/07/lunettes-soleil-femme-tendance.jpg',
    description: 'Protection UV maximale avec un design moderne et tendance.',
  },
  {
    id: 'antireflet-glasses',
    name: 'Lunettes Antireflet',
    category: 'optique',
    subCategory: 'Confort',
    image: 'https://www.alaminevision.com/web/image/product.template/30/image_1024?unique=57d2d08',
    description: 'Traitement antireflet pour un confort visuel optimal devant les écrans.',
  },
];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-black/20">W</div>
          <div className="flex flex-col">
            <span className={`font-black text-base tracking-[0.2em] leading-none transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-white'}`}>WAKEUR SERIGNE</span>
            <span className={`font-bold text-[11px] tracking-[0.1em] opacity-60 transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-white'}`}>ABDOUL AKHAD</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className={`text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all relative group ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className={`hover:scale-110 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`}><Search size={18} /></button>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={isScrolled ? 'text-black' : 'text-white'} /> : <Menu className={isScrolled ? 'text-black' : 'text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-black">Accueil</a>
            <a href="#accessoires" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-black">Accessoires</a>
            <a href="#optique" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-black">Ndiguel Optique</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-black">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1556656793-062ff987825d?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-40 scale-110 animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8 border border-white/20">
            L'Excellence à Votre Portée
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            WAKEUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">SERIGNE</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed opacity-80">
            Une sélection exclusive d'accessoires premium et l'expertise de Ndiguel Optique pour sublimer votre quotidien.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="#accessoires" 
              className="group relative bg-white text-black px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explorer les Accessoires <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a 
              href="#optique" 
              className="group bg-transparent border-2 border-white/30 text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-3"
            >
              Ndiguel Optique <Glasses size={20} />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Shield size={24} />, title: "Qualité Garantie", desc: "Produits sélectionnés avec soin" },
    { icon: <Truck size={24} />, title: "Livraison Rapide", desc: "Partout au Sénégal" },
    { icon: <Eye size={24} />, title: "Expertise Optique", desc: "Conseils professionnels" },
    { icon: <Clock size={24} />, title: "Service 24/7", desc: "Support client réactif" },
  ];

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryShowcase = ({ onSelect }: { onSelect: (cat: 'accessoires' | 'optique') => void }) => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            whileHover={{ y: -10 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden group cursor-pointer"
            onClick={() => onSelect('accessoires')}
          >
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" 
              alt="Accessoires" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4">Collection Tech</span>
              <h3 className="text-4xl font-black text-white mb-6">Accessoires de Téléphone</h3>
              <button className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                Découvrir <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden group cursor-pointer"
            onClick={() => onSelect('optique')}
          >
            <img 
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1000" 
              alt="Optique" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4">Expertise Visuelle</span>
              <h3 className="text-4xl font-black text-white mb-6">Ndiguel Optique</h3>
              <button className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                Découvrir <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, isAdmin, onDelete }: { product: Product, isAdmin?: boolean, onDelete?: (id: string) => void }) => {
  const handleOrder = () => {
    const message = `Bonjour, je souhaite commander : ${product.name}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const isNew = product.id === 'iphone-17-pm';

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 h-full flex flex-col relative">
      {isAdmin && onDelete && (
        <button 
          onClick={() => onDelete(product.id)}
          className="absolute top-6 right-6 z-20 bg-red-500 text-white p-3 rounded-full shadow-xl hover:bg-red-600 transition-all hover:scale-110 active:scale-90"
        >
          <Trash2 size={18} />
        </button>
      )}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700"></div>
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
            {product.subCategory}
          </span>
          {isNew && (
            <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm animate-pulse">
              Nouveau
            </span>
          )}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">{product.description}</p>
        
        <div className="mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={handleOrder}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Commander <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, id }: { title: string, subtitle: string, id: string }) => (
  <div id={id} className="text-center mb-20 pt-32">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">{subtitle}</p>
      <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8">{title}</h2>
      <div className="w-24 h-1.5 bg-black mx-auto rounded-full"></div>
    </motion.div>
  </div>
);

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg">W</div>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-[0.2em] leading-none text-black">WAKEUR SERIGNE</span>
                <span className="font-bold text-[11px] tracking-[0.1em] opacity-60 text-black">ABDOUL AKHAD</span>
              </div>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mb-10 font-medium">
              Votre destination de confiance pour l'excellence technologique et le confort visuel au Sénégal.
            </p>
            <div className="flex gap-4">
              {[<Instagram size={20} />, <Facebook size={20} />, <Twitter size={20} />].map((icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-1">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-600 hover:text-black transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-black transition-all group-hover:w-4"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Légal</h4>
            <ul className="space-y-4">
              {['Confidentialité', 'Conditions', 'Livraison', 'Retours'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-gray-600 hover:text-black transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-black transition-all group-hover:w-4"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-400 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} Wakeur Serigne Abdoul Akhad Mbacké. Tous droits réservés.
          </p>
          <div className="flex items-center gap-8">
            <button 
              onClick={onAdminClick}
              className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <LogIn size={14} /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AdminLogin = ({ onLogin, onClose }: { onLogin: (user: User) => void, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err: any) {
      setError('Erreur lors de la connexion Google. Vérifiez que la méthode est activée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' && email === 'wakeur@gmail.com') {
        try {
          const { createUserWithEmailAndPassword } = await import('firebase/auth');
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          onLogin(userCredential.user);
          return;
        } catch (createErr: any) {
          setError('Erreur lors de la création du compte admin.');
          console.error(createErr);
        }
      }
      setError('Identifiants invalides. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">Connexion Admin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="wakeur@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Ou</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-200 text-black py-4 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Se connecter avec Google
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPanel = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<'accessoires' | 'optique'>('accessoires');
  const [subCategory, setSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await addDoc(collection(db, 'products'), {
        name,
        description,
        price,
        image,
        category,
        subCategory,
        createdAt: serverTimestamp()
      });
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setSubCategory('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 mb-24 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black mb-2">Tableau de Bord Admin</h2>
          <p className="text-gray-500">Connecté en tant que <span className="font-bold text-black">{user.email}</span></p>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all text-red-500"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-black mb-8 flex items-center gap-2">
          <Plus className="bg-black text-white rounded-lg p-1" size={24} /> Ajouter un Nouveau Produit
        </h3>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                <Package size={14} /> Nom du Produit
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="ex: iPhone 17 Pro Max"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                <Info size={14} /> Description
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all h-32 resize-none"
                placeholder="Détails du produit..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  <DollarSign size={14} /> Prix
                </label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="ex: 850 000 FCFA"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  <Tag size={14} /> Sous-catégorie
                </label>
                <input 
                  type="text" 
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="ex: Smartphone"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                <ImageIcon size={14} /> URL de l'image
              </label>
              <input 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Catégorie Principale</label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setCategory('accessoires')}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-all ${category === 'accessoires' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  Accessoires
                </button>
                <button 
                  type="button"
                  onClick={() => setCategory('optique')}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-all ${category === 'optique' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  Optique
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Ajout en cours...' : 'Ajouter le Produit'}
              </button>
              {success && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-center mt-4 font-bold"
                >
                  Produit ajouté avec succès !
                </motion.p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'accessoires' | 'optique'>('accessoires');
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setDbProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const allProducts = [...dbProducts, ...PRODUCTS];
  const filteredProducts = allProducts.filter(p => p.category === activeTab);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <CategoryShowcase onSelect={(cat) => {
        setActiveTab(cat);
        const element = document.getElementById('products-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <main id="products-section" className="max-w-7xl mx-auto px-4 pb-24">
        {user && (
          <AdminPanel user={user} onLogout={handleLogout} />
        )}

        {showLogin && !user && (
          <AdminLogin 
            onLogin={(u) => { setUser(u); setShowLogin(false); }} 
            onClose={() => setShowLogin(false)} 
          />
        )}

        {/* Category Switcher */}
        <div className="flex justify-center gap-4 mb-12 mt-12">
          <button 
            onClick={() => setActiveTab('accessoires')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'accessoires' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Accessoires
          </button>
          <button 
            onClick={() => setActiveTab('optique')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'optique' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Ndiguel Optique
          </button>
        </div>

        {/* Section Content */}
        {activeTab === 'accessoires' ? (
          <section>
            <SectionHeader 
              id="accessoires"
              title="Accessoires de Téléphone" 
              subtitle="Technologie & Style" 
            />

            {/* Featured Product: iPhone 17 Pro Max */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24 relative overflow-hidden rounded-[3rem] bg-black text-white p-12 md:p-20 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
              <div className="flex-1 z-10">
                <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Produit Vedette</span>
                <h3 className="text-5xl md:text-7xl font-black mb-6 leading-tight">iPhone 17 <br/>Pro Max</h3>
                <p className="text-gray-400 text-lg mb-10 max-w-md">L'apogée de l'innovation technologique. Un système de caméra révolutionnaire et une puissance inégalée.</p>
                <a 
                  href={`https://wa.me/+221776861157?text=Bonjour, je souhaite commander l'iPhone 17 Pro Max`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Commander Maintenant <ChevronRight size={18} />
                </a>
              </div>
              <div className="flex-1 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000" 
                  alt="iPhone 17 Pro Max" 
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ProductCard 
                      product={product} 
                      isAdmin={!!user} 
                      onDelete={handleDeleteProduct}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        ) : (
          <section>
            <SectionHeader 
              id="optique"
              title="Ndiguel Optique" 
              subtitle="Votre Vue, Notre Priorité" 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ProductCard 
                      product={product} 
                      isAdmin={!!user} 
                      onDelete={handleDeleteProduct}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Optical Services List */}
            <div className="mt-32 mb-24">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Nos Services Spécialisés</h3>
                <p className="text-gray-500 max-w-xl mx-auto">Expertise et technologie au service de votre vision.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: "Lunettes Correcteurs", desc: "Verres de prescription haute précision pour corriger la myopie, l'hypermétropie et l'astigmatisme.", icon: <ShieldCheck size={24} /> },
                  { title: "Lunettes Photogrey", desc: "Verres photochromiques qui s'assombrissent instantanément à l'extérieur et redeviennent clairs à l'intérieur.", icon: <Zap size={24} /> },
                  { title: "Lunettes Simples", desc: "Montures élégantes et verres standards pour un usage quotidien sans compromis sur le style.", icon: <Glasses size={24} /> },
                  { title: "Lunettes de Soleil", desc: "Protection UV 400 intégrale avec des designs tendance pour protéger vos yeux avec élégance.", icon: <Sun size={24} /> },
                  { title: "Lunettes Antireflet", desc: "Traitement spécial pour éliminer les reflets parasites, idéal pour la conduite de nuit et le travail sur écran.", icon: <Lightbulb size={24} /> },
                ].map((service, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                      {service.icon}
                    </div>
                    <h4 className="text-xl font-black mb-3">{service.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Optical Features */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gray-50 rounded-[3rem] p-12 md:p-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-black" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-4">Qualité Certifiée</h4>
                <p className="text-gray-500 text-sm">Tous nos verres sont testés et certifiés pour une protection optimale.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-black" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-4">Service Rapide</h4>
                <p className="text-gray-500 text-sm">Montage et ajustement de vos lunettes dans les meilleurs délais.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="text-black" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-4">Conseil Expert</h4>
                <p className="text-gray-500 text-sm">Une équipe dédiée pour vous aider à choisir la monture parfaite.</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer onAdminClick={() => setShowLogin(true)} />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Besoin d'aide ?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour vous conseiller et répondre à toutes vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-green-600 transition-all"
            >
              <MessageCircle size={24} /> WhatsApp
            </a>
            <a 
              href="tel:+221776861157"
              className="flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              <Phone size={24} /> Appeler
            </a>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <motion.a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-5 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:shadow-[#25D366]/60 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle size={32} fill="currentColor" />
      </motion.a>
    </div>
  );
}
