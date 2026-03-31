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
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User,
  signInWithEmailAndPassword,
  getAuth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const WHATSAPP_LINK = "https://wa.me/221765224562";

interface Product {
  id: string;
  name: string;
  category: 'accessoires' | 'optique';
  subCategory: string;
  price?: number;
  image?: string;
  description: string;
  isNew?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Écouteurs sans fil (TWS / Bluetooth)',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://www.manojia.com/wp-content/uploads/2024/02/CASQUE-BLUETOOTH-EARBUD-ECOUTEUR-SANS-FIL-TWS-PRO-5S-NOIR-1.png',
    description: 'Son haute fidélité, réduction de bruit active et autonomie longue durée.',
    isNew: true
  },
  {
    id: '2',
    name: 'Casque Beats Studio3 Rouge',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://static.fnac-static.com/multimedia/Images/36/36/59/5D/6117686-3-1541-1/tsp20240916110822/Casque-a-reduction-de-bruit-Beats-Studio3-Rouge.jpg',
    description: 'Le luxe du son Beats avec une finition rouge éclatante.',
    isNew: true
  },
  {
    id: '3',
    name: 'Coques iPhone Collection',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://img.lemde.fr/2021/02/15/500/0/6000/3000/1440/720/60/0/a7e778d_584537715-iphonecases2020-fullres-9308.jpg',
    description: 'Protection élégante pour tous les modèles d\'iPhone.',
  },
  {
    id: '4',
    name: 'Lunettes de Vue Ndiguel',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800',
    description: 'Montures élégantes et verres correcteurs de haute précision.',
    isNew: true
  },
  {
    id: '5',
    name: 'Montres connectées Premium',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.sport-passion.fr/pictures/les-meilleures-montres-connectees.jpg',
    description: 'Suivi de santé, notifications et divers bracelets interchangeables.',
    isNew: true
  },
  {
    id: '6',
    name: 'JBL Flip 5 Rouge',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://uno.ma/pub/media/catalog/product/cache/af8d7fd2c4634f9c922fba76a4a30c04/e/n/enceinte-portable-jbl-flip5-bluetooth-rouge-uno-maroc.jpg',
    description: 'Enceinte portable Bluetooth étanche avec un son puissant.',
  },
  {
    id: '17',
    name: 'JBL Flip 6',
    category: 'accessoires',
    subCategory: 'Audio',
    description: 'Le son audacieux JBL Pro avec un système de haut-parleurs à 2 voies.',
  },
  {
    id: '18',
    name: 'JBL Boombox 4',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://cdn.idealo.com/folder/Product/207820/2/207820290/s4_produktbild_max/jbl-boombox-4.jpg',
    description: 'L\'enceinte Bluetooth portable la plus puissante avec des basses monstrueuses.',
  },
  {
    id: '19',
    name: 'JBL Go 3',
    category: 'accessoires',
    subCategory: 'Audio',
    description: 'Style audacieux et son JBL Pro ultra-portable.',
  },
  {
    id: '20',
    name: 'Mini Haut-Parleur JBL M3',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://imychic.com/wp-content/uploads/2023/08/Mini-Haut-Parleur-Fort-JBL-M3-3-800x800.jpg',
    description: 'Petit par la taille, grand par le son. Idéal pour les déplacements.',
  },
  {
    id: '21',
    name: 'JBL Flip 7 Blue',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://global.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw3e24fb0a/JBL_FLIP_7_HERO_BLUE_079_x1.png?sw=320&sh=320',
    description: 'La nouvelle génération de son portable avec une clarté exceptionnelle.',
  },
  {
    id: '22',
    name: 'JBL Boombox 3 Wi-Fi',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://stereoplus.com/cdn/shop/files/827783_7_800x.jpg?v=1733355999',
    description: 'Son massif JBL Original Pro et Wi-Fi pour une diffusion haute résolution.',
  },
  {
    id: '7',
    name: 'Coques Silicone Liquide',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://media2.apokin.es/223057-large_default/coque-en-silicone-liquide-effet-peau-samsung-galaxy-a14-5g-disponible-en-14-couleurs.jpg',
    description: 'Protection douce et résistante pour Samsung Galaxy.',
  },
  {
    id: '8',
    name: 'Coques Shockproof Color',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://image.made-in-china.com/202f0j00sctkueBCZlbf/Shockproof-Color-Lens-Protection-Soft-TPU-PC-Phone-Case-for-iPhone-14-13-PRO-Max.webp',
    description: 'Protection renforcée avec design coloré pour iPhone.',
  },
  {
    id: '9',
    name: 'Chargeur Rapide GOLDNEXT',
    category: 'accessoires',
    subCategory: 'Énergie',
    image: 'https://m.media-amazon.com/images/I/51PsiQcKA8L._AC_UF894,1000_QL80_.jpg',
    description: 'Chargeur mural ultra-rapide compatible tous smartphones.',
  },
  {
    id: '10',
    name: 'Bloc Chargeur USB-C 20W',
    category: 'accessoires',
    subCategory: 'Énergie',
    image: 'https://www.phonexpert78.com/Files/132749/Img/23/chargeur-iphone-rapide-usbc-zoom.jpg',
    description: 'Chargeur compact haute performance pour iPhone.',
  },
  {
    id: '11',
    name: 'Câble USB 3-en-1 Callstel',
    category: 'accessoires',
    subCategory: 'Câbles',
    image: 'https://m.media-amazon.com/images/I/61UfJ-u5uNL._AC_UF894,1000_QL80_.jpg',
    description: 'Câble universel Lightning, Type-C et Micro-USB.',
  },
  {
    id: '12',
    name: 'Câble Hybride Silicone',
    category: 'accessoires',
    subCategory: 'Câbles',
    image: 'http://www.hypershop.com/cdn/shop/files/hyperjuice-usb-c-and-lightning-hybrid-silicone-cable-15m5ft-5227615.webp?v=1762811865',
    description: 'Câble ultra-résistant et flexible pour charge rapide.',
  },
  {
    id: '13',
    name: 'Ring Light 10" avec Trépied',
    category: 'accessoires',
    subCategory: 'Studio',
    image: 'https://images-cdn.ubuy.com.sa/634e535fe5cca1443f3ab9d2-10-39-39-ring-light-with-tripod.jpg',
    description: 'Éclairage parfait pour vos vidéos TikTok et selfies.',
  },
  {
    id: '14',
    name: 'Kit Softbox Studio LED',
    category: 'accessoires',
    subCategory: 'Studio',
    image: 'https://www.rekfi.com/storage/2025/06/Kit-Eclairage-Studio-PULUZ-2x-Softbox-50x70-cm-avec-8-Ampoules-LED-E27-–-Lumiere-Continue-5700K-pour-Photo-et-Video.jpeg',
    description: 'Éclairage professionnel continu pour studio photo.',
  },
  {
    id: '15',
    name: 'Montre Classique MATY',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.maty.com/images/DynamicPage/comment-choisir-sa-montre/hero-montre-desktop.jpg',
    description: 'Design intemporel et élégance pour toutes les occasions.',
  },
  {
    id: '16',
    name: 'Montre Vintage Homme',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://media.gqmagazine.fr/photos/66e7fd5dfa7f07d3786c5194/16:9/w_2560,c_limit/Montres%20Vintage.jpg',
    description: 'Le charme du rétro allié à la précision moderne.',
  },
  {
    id: '23',
    name: 'Lunettes Gucci Correcteur',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://www.senachat.com/public/uploads/all/vS1ffYLhfgkXlg35cH69MeVBSn95ANHyl7cQRbeG.jpg',
    description: 'Verre correcteur de luxe pour homme et femme.',
  },
  {
    id: '24',
    name: 'Osmose Optique Métal',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://s3.octika.com/125016-new_product_size/osmose-optique-metal-bleu-turquoise-femme-os875c3.jpg',
    description: 'Monture en métal bleu turquoise élégante et légère.',
  },
  {
    id: '25',
    name: 'Monture Couleur Paris',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://opticien-paris-16.fr/wp-content/uploads/2023/12/opticien-paris-16-couleur-lunettes-de-vue-1024x768.jpg',
    description: 'Design coloré et moderne pour une vision parfaite.',
  },
  {
    id: '26',
    name: 'Verres Photochromiques Tendance',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.octika.com/img/cms/Blog/2024/OCT/Verres_photochromiques_et_tendances%E2%80%8B.jpg',
    description: 'Verres qui s\'adaptent intelligemment à la luminosité.',
  },
  {
    id: '27',
    name: 'Transitions Color',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.newlook.ca/cdn/shop/files/Transition-color.gif?v=1718121276&width=320',
    description: 'Technologie de transition de couleur rapide et efficace.',
  },
  {
    id: '28',
    name: 'Lentiamo Photochromic',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.lentiamo.fr/images/upload/photochromic-lenses-FR.BE.jpg',
    description: 'Protection UV totale avec changement de teinte automatique.',
  },
  {
    id: '29',
    name: 'Opticien Nîmes Photo',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://opticien-enfant-nimes.fr/wp-content/uploads/2018/10/image-1.png',
    description: 'Confort visuel optimal en intérieur comme en extérieur.',
  },
  {
    id: '30',
    name: 'Varionet Photochromique',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://cdn.shopify.com/s/files/1/0855/6878/files/verres_photochromiqes_1_480x480.png?v=1678186070',
    description: 'Verres photochromiques haute performance pour une vision nette.',
  },
  {
    id: '31',
    name: 'Octika Solaire Couleur',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.octika.com/img/cms/Blog/nov/Choix_de_la_couleur_des_verres_solaires.jpg',
    description: 'Large choix de teintes pour vos verres photochromiques.',
  },
  {
    id: '32',
    name: 'Ray-Ban Change',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://media.essilorluxottica.com/cms/caas/v1/media/206182/data/68dcade5a80683fcc04fc63c5c71f010/240521-rayban-change-4x5-03-v001-final.jpg',
    description: 'Montures innovantes qui changent de couleur avec la lumière.',
  },
  {
    id: '33',
    name: 'La Revue des Opticiens Change',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://larevuedesopticiens.com/galleriesrdo/3mlkrbmgsqgwk/xl/Change-30-7fe5.jpg',
    description: 'Style et technologie réunis dans une monture unique.',
  },
  {
    id: '34',
    name: 'Intelligent Photochromic',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://m.media-amazon.com/images/I/51P0p9JGq4L._AC_UF1000%2C1000_QL80_.jpg',
    description: 'Verres intelligents à changement de teinte rapide.',
  },
  {
    id: '35',
    name: 'Simple Eyewear Hector',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://simple-eyewear.com/cdn/shop/products/Face-Hector-1_2048x.jpg?v=1680521539',
    description: 'Design minimaliste et épuré pour un look intemporel.',
  },
  {
    id: '36',
    name: 'Trio Stationery PL7870',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://img.ebdcdn.com/product/front/white/pl7870.jpg',
    description: 'Monture classique et robuste pour un usage quotidien.',
  },
  {
    id: '37',
    name: 'Simple Eyewear HOFF',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://simple-eyewear.com/cdn/shop/products/HOFF_05_01_2048x.jpg?v=1680523459',
    description: 'Élégance simple et confort exceptionnel.',
  },
  {
    id: '38',
    name: 'Coolminiprix Rectangulaire',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://www.coolminiprix.com/155432-large_default/lunettes-de-vue-rectangulaire-simple-mix.jpg',
    description: 'Monture rectangulaire classique, sobre et efficace.',
  },
  {
    id: '39',
    name: 'Lunigal Simple HOFF',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://www.lunigal.fr/images/lunettes/lunettes-de-soleil-simple-57487z.jpg',
    description: 'Le style HOFF revisité avec simplicité.',
  },
  {
    id: '40',
    name: 'Business Optical Half Frame',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://image.made-in-china.com/202f0j00hqBkAUQRlJbd/Simple-Literary-Business-Optical-Glasses-Men-and-Women-Half-Frame-Glasses.webp',
    description: 'Monture demi-cerclée pour un look professionnel et intellectuel.',
  },
  {
    id: '41',
    name: 'Jumia Polarisée Unisexe',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://sn.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/13/727221/1.jpg?3998',
    description: 'Lunettes de soleil polarisées pour une protection maximale.',
  },
  {
    id: '42',
    name: 'Tech Access Polarized',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://tech-access-dakar.com/wp-content/uploads/2021/10/1634071027052.png',
    description: 'Design moderne et verres polarisés haute performance.',
  },
  {
    id: '43',
    name: 'Horus X Plage',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://horus-x.com/cdn/shop/articles/un_homme_portant_des_lunettes_de_soleil_Horus_X_a_la_plage_5b83dd17-df0e-4f13-9e00-4e341ce70c1f.jpg?v=1712736925&width=1200',
    description: 'Protection solaire catégorie 3 pour vos journées à la plage.',
  },
  {
    id: '44',
    name: 'Smatis Protection Solaire',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://www.smatis.fr/wp-content/uploads/2023/12/lunettes-de-soleil-768x511.jpeg',
    description: 'Protégez vos yeux avec style et efficacité.',
  },
  {
    id: '45',
    name: 'Eyebuydirect SMT7054',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://img.ebdcdn.com/product/front/white/smt7054.jpg',
    description: 'Monture solaire tendance pour un look estival parfait.',
  },
  {
    id: '46',
    name: 'Photogray Antireflet Homme',
    category: 'optique',
    subCategory: 'Antireflet',
    image: 'https://elegancesenegal.com/wp-content/uploads/2022/04/Photogray-antireflet-homme.jpg',
    description: 'Confort visuel supérieur avec traitement antireflet.',
  },
  {
    id: '47',
    name: 'Aura Bio Antireflet',
    category: 'optique',
    subCategory: 'Antireflet',
    image: 'https://img.leboncoin.fr/api/v1/lbcpb1/images/4b/73/8a/4b738ab2edceb3fd9df2e23ed5d59abd1ec90a7b.jpg?rule=ad-large',
    description: 'Verres antireflet pour une vision claire et sans reflets gênants.',
  },
  {
    id: '48',
    name: 'Eyebuydirect PM0571',
    category: 'optique',
    subCategory: 'Antireflet',
    image: 'https://img.ebdcdn.com/product/front/gray/pm0571.jpg?q=70&im=Resize,width=600,height=300,aspect=fill;UnsharpMask,sigma=1.0,gain=1.0',
    description: 'Traitement antireflet haute qualité pour un confort quotidien.',
  },
  {
    id: '49',
    name: 'Kokoon Protect Anti-Lumière Bleue',
    category: 'optique',
    subCategory: 'Antireflet',
    image: 'https://kokoon-protect.fr/wp-content/uploads/2018/09/3512-thickbox_default-Lunette-anti-lumiere-bleue-homme.jpg',
    description: 'Protection contre la lumière bleue et les reflets pour écrans.',
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-all duration-500 shadow-lg">N</div>
          <div className="flex flex-col">
            <span className={`font-black text-sm tracking-[0.2em] leading-none transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>NDIGUEL</span>
            <span className={`font-bold text-[10px] tracking-[0.1em] opacity-60 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>OPTIQUE & PRESTIGE</span>
          </div>
        </div>

        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className={`transition-all hover:tracking-[0.4em] ${isScrolled ? 'text-black' : 'text-white'}`}>{item}</a>
          ))}
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 md:hidden">
            <div className="flex flex-col gap-6 text-center font-black uppercase tracking-widest text-sm">
              {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-gray-500">{item}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-10"></div>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1511499767390-a7335958beba?q=80&w=1920&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-70" 
          alt="Hero Background" 
        />
      </div>
      
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">L'Art de la Vision & du Prestige</span>
          </div>
          <h1 className="text-7xl md:text-[12rem] font-black text-white tracking-tighter mb-10 leading-[0.8]">
            NDIGUEL<br />
            <span className="bg-gradient-to-r from-white via-white/70 to-white/20 bg-clip-text text-transparent">OPTIQUE</span>
          </h1>
          <p className="text-white/60 text-base md:text-2xl mb-14 font-light leading-relaxed max-w-3xl mx-auto tracking-wide">
            L'excellence visuelle rencontre l'innovation technologique. <br className="hidden md:block" /> Découvrez notre sélection exclusive de montures de luxe et d'accessoires de prestige.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <a href="#products-section" className="group relative px-14 py-6 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-20 hover:scale-105 active:scale-95 shadow-2xl">
              <span className="relative z-10">Explorer la Collection</span>
              <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={20} />
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-14 py-6 bg-white/5 backdrop-blur-xl text-white border border-white/10 font-black rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              Service Client
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-6 opacity-30">
        <div className="flex gap-4">
          <Instagram size={16} className="text-white hover:text-white/100 cursor-pointer transition-colors" />
          <Facebook size={16} className="text-white hover:text-white/100 cursor-pointer transition-colors" />
          <Twitter size={16} className="text-white hover:text-white/100 cursor-pointer transition-colors" />
        </div>
        <div className="w-px h-24 bg-gradient-to-b from-white to-transparent"></div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Défiler</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-12 bg-gradient-to-b from-white to-transparent"></motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <ShieldCheck size={40} />, title: "Qualité Garantie", desc: "Produits authentiques et certifiés par les plus grandes marques." },
    { icon: <Truck size={40} />, title: "Livraison Rapide", desc: "Expédition sécurisée partout au Sénégal sous 24/48h." },
    { icon: <Zap size={40} />, title: "Expertise Optique", desc: "Examen de la vue et conseils personnalisés par nos opticiens." },
    { icon: <Phone size={40} />, title: "Support Dédié", desc: "Une assistance personnalisée pour toutes vos questions." }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-700 group-hover:rotate-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-black/10">
                {f.icon}
              </div>
              <h3 className="font-black text-sm uppercase tracking-[0.3em] mb-4 text-gray-900">{f.title}</h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[200px]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryShowcase = ({ onSelect }: { onSelect: (cat: 'accessoires' | 'optique') => void }) => {
  return (
    <section className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ scale: 0.98 }}
            onClick={() => onSelect('accessoires')} 
            className="relative h-[600px] rounded-[4rem] overflow-hidden group cursor-pointer shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Accessoires" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="absolute inset-0 border-[20px] border-transparent group-hover:border-white/10 transition-all duration-700 rounded-[4rem]"></div>
            <div className="absolute bottom-16 left-16 right-16">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em] mb-4">Innovation Tech</p>
              <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">ACCESSOIRES<br />PREMIUM</h3>
              <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-6 transition-all">
                Explorer <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            onClick={() => onSelect('optique')} 
            className="relative h-[600px] rounded-[4rem] overflow-hidden group cursor-pointer shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1509100194014-d49809396daa?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Optique" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="absolute inset-0 border-[20px] border-transparent group-hover:border-white/10 transition-all duration-700 rounded-[4rem]"></div>
            <div className="absolute bottom-16 left-16 right-16">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em] mb-4">Confort Visuel</p>
              <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">NDIGUEL<br />OPTIQUE</h3>
              <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-6 transition-all">
                Voir les Montures <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, isAdmin, onDelete }: { product: Product, isAdmin?: boolean, onDelete?: (id: string) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-700 border border-gray-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115" 
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-gray-200">
            <ImageIcon size={64} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">Image bientôt disponible</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {product.isNew && (
          <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md text-black px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20">
            Nouveau
          </div>
        )}

        <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          {isAdmin && (
            <button onClick={() => onDelete?.(product.id)} className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 shadow-2xl transition-all hover:scale-110">
              <Trash2 size={20} />
            </button>
          )}
          <a 
            href={`${WHATSAPP_LINK}?text=Bonjour, je souhaite plus d'informations sur : ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-black hover:text-white shadow-2xl transition-all hover:scale-110"
          >
            <Info size={20} />
          </a>
        </div>
      </div>

      <div className="p-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-black/20"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{product.subCategory}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-black transition-colors">{product.name}</h3>
          </div>
          {product.price && (
            <div className="bg-gray-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-black text-black">{product.price.toLocaleString()} FCFA</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
          {product.description}
        </p>

        <a 
          href={`${WHATSAPP_LINK}?text=Bonjour, je souhaite commander : ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 w-full py-5 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:bg-gray-900 hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
        >
          <MessageCircle size={18} /> COMMANDER
        </a>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, subtitle, id }: { title: string, subtitle: string, id?: string }) => (
  <div id={id} className="text-center mb-20 scroll-mt-32">
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
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg">N</div>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-[0.2em] leading-none text-black">NDIGUEL</span>
                <span className="font-bold text-[11px] tracking-[0.1em] opacity-60 text-black">OPTIQUE & PRESTIGE</span>
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
            © {new Date().getFullYear()} Ndiguel Optique. Tous droits réservés.
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
      setError('Erreur lors de la connexion Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">Connexion Admin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6">
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-4 py-4 border-2 border-gray-100 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continuer avec Google
          </button>
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
        </div>
      </motion.div>
    </div>
  );
};

const AdminPanel = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simple admin check for demo, in real app check Firestore role
    if (user.email === 'peter2005ngouala@gmail.com') {
      setIsAdmin(true);
    }
  }, [user]);

  if (!isAdmin) return null;

  return (
    <div className="bg-black text-white p-6 rounded-[2rem] mb-12 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
          <img src={user.photoURL || ''} alt={user.displayName || ''} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-60">Session Admin</p>
          <p className="font-bold">{user.displayName}</p>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
        <LogOut size={16} /> Déconnexion
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'accessoires' | 'optique'>('accessoires');
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Tous');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const categories = activeTab === 'accessoires' 
    ? ['Tous', 'Audio', 'Protection', 'Énergie', 'Câbles', 'Studio', 'Montres']
    : ['Tous', 'Correcteurs', 'Photogrey', 'Simples', 'Soleil', 'Antireflet'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = p.category === activeTab;
    const matchesSubCategory = selectedSubCategory === 'Tous' || p.subCategory === selectedSubCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

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

      <section className="py-32 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">L'Héritage Ndiguel</h2>
            <h3 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none">
              UNE VISION <br />
              D'EXCEPTION.
            </h3>
            <p className="text-white/60 text-lg leading-relaxed mb-12 font-light tracking-wide">
              Depuis notre création, nous nous engageons à offrir le meilleur de l'optique et de la technologie. Chaque monture, chaque accessoire est sélectionné pour son excellence et son design unique.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="text-4xl font-black mb-2 tracking-tighter">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Authenticité</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2 tracking-tighter">24h</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Support Client</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556196148-1fb724238998?q=80&w=1200" className="w-full h-full object-cover" alt="Prestige" />
            </div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 hidden md:block">
              <Eye size={40} className="mb-6 text-white" />
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Précision optique certifiée par nos experts.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <main id="products-section" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        {user && <AdminPanel user={user} onLogout={handleLogout} />}
        
        {showLogin && !user && (
          <AdminLogin onLogin={(u) => { setUser(u); setShowLogin(false); }} onClose={() => setShowLogin(false)} />
        )}

        <div className="flex flex-col items-center gap-12 mb-24">
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setActiveTab('accessoires'); setSelectedSubCategory('Tous'); }}
              className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'accessoires' ? 'bg-black text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              Accessoires Tech
            </button>
            <button 
              onClick={() => { setActiveTab('optique'); setSelectedSubCategory('Tous'); }}
              className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'optique' ? 'bg-black text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              Ndiguel Optique
            </button>
          </div>

          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-black transition-all outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${selectedSubCategory === cat ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section>
          <SectionHeader 
            title={activeTab === 'accessoires' ? "Accessoires Premium" : "Ndiguel Optique"} 
            subtitle={activeTab === 'accessoires' ? "Technologie & Style" : "Vision & Prestige"} 
          />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeTab}-${selectedSubCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} isAdmin={!!user} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-400 text-sm font-medium">Essayez d'ajuster votre recherche ou vos filtres.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <section id="contact" className="mt-48">
          <SectionHeader title="Nous Contacter" subtitle="Restons en lien" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-8 p-10 bg-green-50 rounded-[3rem] hover:bg-green-100 transition-all duration-500 group border border-green-100/50">
                  <div className="w-20 h-20 bg-green-600 text-white rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-green-200">
                    <MessageCircle size={40} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 mb-2">WhatsApp</p>
                    <p className="text-2xl font-black text-green-900 tracking-tight">+221 76 522 45 62</p>
                    <p className="text-xs font-medium text-green-700/60 mt-1">Réponse instantanée</p>
                  </div>
                </a>
                <a href="tel:+221765224562" className="flex items-center gap-8 p-10 bg-blue-50 rounded-[3rem] hover:bg-blue-100 transition-all duration-500 group border border-blue-100/50">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-blue-200">
                    <Phone size={40} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Appel Direct</p>
                    <p className="text-2xl font-black text-blue-900 tracking-tight">+221 76 522 45 62</p>
                    <p className="text-xs font-medium text-blue-700/60 mt-1">Disponible 24h/24</p>
                  </div>
                </a>
              </div>
              
              <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100">
                <h4 className="text-2xl font-black mb-8 tracking-tight">Envoyez-nous un message</h4>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const message = `Nom: ${formData.get('name')}\nMessage: ${formData.get('message')}`;
                  window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
                }}>
                  <input type="text" name="name" placeholder="Votre Nom" required className="w-full px-8 py-5 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none" />
                  <input type="email" name="email" placeholder="Votre Email" required className="w-full px-8 py-5 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none" />
                  <textarea name="message" placeholder="Votre Message" required className="w-full md:col-span-2 px-8 py-5 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none min-h-[150px]"></textarea>
                  <button type="submit" className="md:col-span-2 py-6 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/10">
                    Envoyer via WhatsApp
                  </button>
                </form>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8">
                  <Info size={32} />
                </div>
                <h4 className="text-xl font-black mb-4 tracking-tight">Notre Boutique</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium mb-6">
                  Retrouvez-nous à Dakar pour une expertise personnalisée et un essayage exclusif de nos montures.
                </p>
                <div className="flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-widest mb-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  Ouvert du Lundi au Samedi
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <Clock size={18} className="text-black" />
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-gray-100">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800" className="w-full h-full object-cover" alt="Location" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Localisation</p>
                  <p className="text-sm font-black text-black">Dakar, Sénégal</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onAdminClick={() => setShowLogin(true)} />

      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-12 transition-all duration-500"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
