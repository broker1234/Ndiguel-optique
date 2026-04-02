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
    name: 'Lunettes de Vue NDIGUEL OPTIQUE',
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
    name: 'Ring Light Professionnelle',
    category: 'accessoires',
    subCategory: 'Studio',
    image: 'https://kadis.com.ng/wp-content/uploads/2024/12/b1-1.jpg',
    description: 'Éclairage LED circulaire pour des vidéos et photos de qualité studio.',
  },
  {
    id: '18',
    name: 'JBL Boombox 4',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://jblonlinestore.com.my/cdn/shop/files/Boombox4_5.jpg?v=1759993646',
    description: 'L\'enceinte Bluetooth portable la plus puissante avec des basses monstrueuses.',
  },
  {
    id: '19',
    name: 'Souris Sans Fil Optique',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://sn.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/87/478221/1.jpg?5555',
    description: 'Souris ergonomique sans fil pour une navigation fluide et précise.',
  },
  {
    id: '20',
    name: 'Mini Haut-Parleur JBL M3',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://www.itplaza.pk/wp-content/uploads/2024/06/8b9ab8b89dd38c76a14fc637dd79137a.jpg',
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
    image: 'https://www.jbl.com.sg/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw77d03f41/PA_JBL_BOOMBOX3_Wi-Fi_Black_Product_Image_Box_1605x1605px.png?sw=537&sfrm=png',
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
    image: 'https://images-eu.ssl-images-amazon.com/images/I/71sTtwJXZhL._AC_UL495_SR435,495_.jpg',
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
    image: 'https://s1.octika.com/126557-product_detail_rect/osmose-optique-metal-noir-homme-os846c1.jpg',
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
    image: 'https://www.luxoptica.mg/wp-content/uploads/2019/08/Visuels-R%C3%A9%C3%A9criture-Luxo1-03-1024x819.png',
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
    image: 'https://tommy-europe.scene7.com/is/image/TommyEurope/MWM1710585_000_main?$b2c_uplp_listing_2560$',
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
    image: 'https://img.fruugo.com/product/4/87/1711268874_0340_0340.jpg',
    description: 'Verres intelligents à changement de teinte rapide.',
  },
  {
    id: '35',
    name: 'Simple Eyewear Hector',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://www.yakiraeyewear.com/wp-content/uploads/2020/12/hector-group.jpg',
    description: 'Design minimaliste et épuré pour un look intemporel.',
  },
  {
    id: '36',
    name: 'Trio Stationery PL7870',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/30/949756/1.jpg?1183',
    description: 'Monture classique et robuste pour un usage quotidien.',
  },
  {
    id: '37',
    name: 'Simple Eyewear HOFF',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://simple-eyewear.com/cdn/shop/products/HOFF_05_02.jpg?v=1680523459',
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
    image: 'https://letuialunettes.com/wp-content/uploads/2022/06/selection-lunettes-optiques.jpg',
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
    image: 'https://img.ebdcdn.com/product/frame/gray/hmt0116_3.jpg',
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
    image: 'https://www.iguanasell.fr/cdn/shop/articles/Portada-Blog_3f8866fa-da80-4acf-8bae-936ff468d052_1200x.jpg?v=1631720095',
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
  {
    id: '50',
    name: 'Casque Bluetooth P9',
    category: 'accessoires',
    subCategory: 'Audio',
    image: 'https://www.soumari.com/wp-content/uploads/2024/09/Casque-Bluetooth-P9-.webp',
    description: 'Casque Bluetooth P9 avec son haute fidélité et design confortable.',
  },
  {
    id: '51',
    name: 'Souris Sans Fil Slim',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://merci.ci/wp-content/uploads/2025/11/61djDHY5BnL._AC_SL1500_.jpg',
    description: 'Souris optique rechargeable 2.4G ultra-fine.',
  },
  {
    id: '52',
    name: 'Souris Sans Fil HP',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://www.ramatek.ci/wyngoaks/2023/02/Souris-sans-fil-HP.jpg',
    description: 'Souris sans fil HP pour une productivité accrue.',
  },
  {
    id: '53',
    name: 'Souris Filaire HP',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://www.hp.com/fr-fr/shop/Html/Merch/Images/c06128715_1750x1285.jpg?imwidth=869',
    description: 'Souris filaire HP fiable et confortable.',
  },
  {
    id: '54',
    name: 'Souris Optique Filaire',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://www.togoinformatique.com/wp-content/uploads/2023/04/M10.jpg',
    description: 'Souris optique avec câble pour PC et Mac.',
  },
  {
    id: '55',
    name: 'Souris HP 1000 Filaire',
    category: 'accessoires',
    subCategory: 'Informatique',
    image: 'https://diaytar.com/wp-content/uploads/imdt2/souris-avec-ca-ble-et-capteur-optique-hp-1000_7325.webp',
    description: 'Souris avec câble et capteur optique HP 1000.',
  },
  {
    id: '56',
    name: 'Anti-Casse iPhone 12 Mini',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'http://iphone-kin.com/wp-content/uploads/2023/06/2-10.png',
    description: 'Protection d\'écran haute résistance pour iPhone 12 Mini.',
  },
  {
    id: '57',
    name: 'Super Verre Protecteur',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://p.globalsources.com/IMAGES/PDT/B1196499581/Super-verre-protecteur-d-ecran.png?ver=5648737996',
    description: 'Verre trempé premium pour une protection maximale de l\'écran.',
  },
  {
    id: '58',
    name: 'Film Anti-Casse Glass S9',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://letuialunettes.com/wp-content/uploads/2022/06/selection-lunettes-optiques.jpg',
    description: 'Film de protection en verre pour Samsung S9.',
  },
  {
    id: '59',
    name: 'Privacy Glass Fumé iPhone 16',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://www.wamia.tn/media/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/1/_/1_16__3_5.jpg',
    description: 'Verre trempé anti-espion et anti-casse pour iPhone 16.',
  },
  {
    id: '60',
    name: 'Anti-Casse Fumé iPhone SE',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://zhooma.com/media/cache/0f/d1/0fd1dd566de51f93c31c3fd9fa42fb73.jpg',
    description: 'Protection d\'écran fumée et résistante pour iPhone SE.',
  },
  {
    id: '61',
    name: 'Coque iPhone 17 Pro Max Transparente MagSafe',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://casewear.fr/1154057-large_default/coque-iphone-17-pro-max-transparente-magsafe-viva.jpg',
    description: 'Coque transparente avec technologie MagSafe pour iPhone 17 Pro Max.',
  },
  {
    id: '62',
    name: 'Coque iPhone 17 Pro Silicone',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://consomac.fr/images/news/coque-iphone-17-pro-1.jpg',
    description: 'Coque en silicone souple pour une protection élégante de votre iPhone 17 Pro.',
  },
  {
    id: '63',
    name: 'Coque MagSafe Silicone iPhone 17 Pro Max',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'http://www.elago.com/cdn/shop/files/S17MSSC69PRO-MT_ef2df700-6795-424a-80f6-a6bdc452b822.jpg?v=1757396745',
    description: 'Coque elago en silicone avec MagSafe pour iPhone 17 Pro Max.',
  },
  {
    id: '64',
    name: 'Coque de Protection iPhone 17 Pro Max',
    category: 'accessoires',
    subCategory: 'Protection',
    image: 'https://i.ebayimg.com/images/g/MAwAAeSwobZov47w/s-l1200.jpg',
    description: 'Coque de protection robuste pour iPhone 17 Pro Max.',
  },
  {
    id: '65',
    name: 'Manette PS4 DualShock 4 (Noir)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://gsmsenegal.com/wp-content/uploads/2020/09/manette-ps4.jpg',
    description: 'Manette sans fil DualShock 4 pour PlayStation 4, ergonomique et précise.',
  },
  {
    id: '66',
    name: 'Manette PS4 DualShock 4 (Bleu)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://merhaba.sn/wp-content/uploads/2025/06/Dualshock-Blue.png',
    description: 'Manette sans fil DualShock 4 en bleu pour PS4, avec pavé tactile et haut-parleur intégré.',
  },
  {
    id: '67',
    name: 'Manette PS2 Play (Noir)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://www.soumari.com/wp-content/uploads/2023/11/Manette-PLAY-PS2.jpg',
    description: 'Manette classique pour PlayStation 2, robuste et fiable.',
  },
  {
    id: '68',
    name: 'Manette PS2 avec Fil (Couleur)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://bakhbade.com/wp-content/uploads/2024/02/RSTAR-REGULATEUR-COURANT-MCD-500VA-2024-02-24T132057.946.png',
    description: 'Manette PS2 avec fil, design coloré pour une expérience de jeu rétro.',
  },
  {
    id: '69',
    name: 'Manette PS3 Play (Noir)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://www.soumari.com/wp-content/uploads/2019/08/MANETTE-PLAY-3-12000.png',
    description: 'Manette sans fil pour PlayStation 3, idéale pour tous vos jeux.',
  },
  {
    id: '70',
    name: 'Manette PS3 DualShock 3 (Noir)',
    category: 'accessoires',
    subCategory: 'Gaming',
    image: 'https://sn.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/22/64289/1.jpg?4018',
    description: 'Manette Sony DualShock 3 noire pour PlayStation 3 avec retour de force.',
  },
  {
    id: '71',
    name: 'Ventilateur Mural Roch',
    category: 'accessoires',
    subCategory: 'Maison',
    image: 'http://www.electromenager-dakar.com/wp-content/uploads/2025/02/Electromenager-dakar-15-14-1.png',
    description: 'Ventilateur mural Roch RWF-1805R avec télécommande pour un confort optimal.',
  },
  {
    id: '72',
    name: 'Montre Tommy Hilfiger Homme',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://tommy-europe.scene7.com/is/image/TommyEurope/MWM1710585_000_main?$b2c_uplp_listing_2560$',
    description: 'Élégance classique avec bracelet en cuir et cadran raffiné.',
  },
  {
    id: '73',
    name: 'M-Watch Bicolor 41',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.uhren-shop.ch/37591-large_default/m-watch-bicolor-41-montre-suisse-quartz-gris.jpg',
    description: 'Montre suisse à quartz, design bicolore gris et acier.',
  },
  {
    id: '74',
    name: 'Montre Connectée Multifonctions',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://i0.wp.com/swissproline.ch/wp-content/uploads/2024/07/Montre-connectee-multifonctions_-noir.png?fit=1920%2C1920&ssl=1',
    description: 'Suivi d\'activité complet et notifications intelligentes.',
  },
  {
    id: '75',
    name: 'Montre My Time Action',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://asset.action.com/image/upload/t_digital_product_image/w_1080/2563439_8718969955720-110_01_gxdwyo.webp',
    description: 'Montre moderne et accessible pour un style quotidien.',
  },
  {
    id: '76',
    name: 'Montre LIGE Chrono Sport',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://akrochic.com/cdn/shop/files/montre-lige-chrono-sport-posee-pierre-noire-bracelet-cuir-marron-cadran-noir-argent.jpg?v=1720173925',
    description: 'Chronographe sportif avec bracelet en cuir marron.',
  },
  {
    id: '77',
    name: 'Mauboussin Il Est Grand Temps',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://ci.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/03/651972/1.jpg?3832',
    description: 'Élégance turquoise signée Mauboussin.',
  },
  {
    id: '78',
    name: 'Daniel Wellington Classic',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://montreskull.fr/wp-content/uploads/2023/01/OLEVS-montre-Quartz-pour-homme-classique-tanche-lumineuse-bracelet-en-cuir-affichage-de-la-Date-luxe-5.jpg',
    description: 'Le minimalisme suédois par excellence.',
  },
  {
    id: '79',
    name: 'CLUSE Boho Chic',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://cluse.com/cdn/shop/files/CW13801_frontal.jpg?v=1701936676&width=1080',
    description: 'Monture dorée et cadran blanc pour un look bohème chic.',
  },
  {
    id: '80',
    name: 'Louis Pion Multifonctions',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.louispion.fr/media/catalog/product/8/4/8430622775284_1_3afe.jpg?optimize=medium&fit=bounds&height=1000&width=1000&canvas=1000:1000',
    description: 'Montre polyvalente avec plusieurs cadrans de précision.',
  },
  {
    id: '81',
    name: 'Hamilton Jazzmaster Open Heart',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.hamiltonwatch.com/media/catalog/product/cache/416458e74bb900764161801e331f7d59/h/3/h32705180.png',
    description: 'Montre automatique avec mécanisme apparent.',
  },
  {
    id: '82',
    name: 'BOSS Montre Chronographe',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://images.hugoboss.com/is/image/boss/hbeu58733301_999_200?$large$=&fit=crop,1&align=1,1&bgcolor=ebebeb&lastModified=1773927517000&qlt=80&resMode=sharp2&wid=338',
    description: 'Design sophistiqué et précision Hugo Boss.',
  },
  {
    id: '83',
    name: 'Fossil Raquel Cuir',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://fossil.scene7.com/is/image/FossilPartners/ES5464_main?$sfcc_fos_medium$',
    description: 'Montre rectangulaire avec bracelet en cuir noir.',
  },
  {
    id: '84',
    name: 'Electroplanet Smartwatch',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://media.electroplanet.ma/media/catalog/category/MONTRE_1.webp',
    description: 'Le meilleur de la technologie connectée.',
  },
  {
    id: '85',
    name: 'Horel Aviation',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://horel.com/img/cms/HOME-CAT-AVIATION.jpg',
    description: 'Style aviateur robuste et fonctionnel.',
  },
  {
    id: '86',
    name: 'Casio Multisports Digitale',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://moineau-instruments.com/7194-large_default/montre-digitale-casio-multisports-coloris-noir-ecran-noir-digits-blancs.jpg',
    description: 'La fiabilité Casio pour toutes vos activités sportives.',
  },
  {
    id: '87',
    name: 'Festina Ceramic Femme',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.3suisses.fr/media/produits/festina/img/montre-festina--femme-f20639-a_3672519_500x500.jpg',
    description: 'Alliage de céramique et d\'acier pour une élégance durable.',
  },
  {
    id: '88',
    name: 'Samsung Galaxy Watch 8',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://static.fnac-static.com/multimedia/Images/FR/MDM/7a/40/b3/28524666/1540-1/tsp20260224173615/Montre-connectee-Samsung-Galaxy-Watch-8-40-mm-4G-Graphite.jpg',
    description: 'Dernière génération de montre connectée Samsung.',
  },
  {
    id: '89',
    name: 'Montre Cristal Magnétique',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://promo.sn/wp-content/uploads/2021/08/Montre-Femme-cristal-a-bracelet-magnetique-1.jpg',
    description: 'Bracelet magnétique et cadran effet cristal.',
  },
  {
    id: '90',
    name: 'Festina Classique Femme',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://imageconv.festinagroup.com/convert?code=eyJidWNrZXQiOiJia3QtZmVzdGluYS1jbXMtc3RyYXBpLWVudi1wcmotcC1wbGF0Zm9ybS1lY29tbWVyY2UtMWVmMyIsImtleSI6IjE3NzM5Mzk3MjUxMjQtcmVsb2otbXVqZXItY2VyYW1pYy1mZXN0aW5hLmpwZyIsInBhdGgiOiJmZXN0aW5hLWNtcyIsImVkaXRzIjp7ImZpdCI6Imluc2lkZSJ9fQ%3D%3D',
    description: 'Un classique intemporel pour toutes les femmes.',
  },
  {
    id: '91',
    name: 'Histoire d\'Or Automatique',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.histoiredor.com/dw/image/v2/BCQS_PRD/on/demandware.static/-/Sites-THOM_CATALOG/default/dwfc3bd637/images/70580103782-master_HO.jpg?sw=474&sh=474',
    description: 'Montre automatique raffinée avec cadran squelette.',
  },
  {
    id: '92',
    name: 'Sector 230 Chrono',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.bijourama.com/media/produits/sector-montres/img/montre-homme--sector-montres-230-r3273661029-bracelet-acier-noir_r3273661029_500x500.jpg',
    description: 'Chronographe en acier noir pour un look affirmé.',
  },
  {
    id: '93',
    name: 'Montre Homme Or Quartz',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://m.media-amazon.com/images/I/61u2TsMC+tL._AC_UY350_.jpg',
    description: 'Finition dorée luxueuse et mouvement quartz précis.',
  },
  {
    id: '94',
    name: 'Aelys Montre Tendance',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://aelys.fr/47596-large_default/product.jpg',
    description: 'Design contemporain et élégant.',
  },
  {
    id: '95',
    name: 'Pierre Lannier Espérance',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/20/996571/1.jpg?5707',
    description: 'Montre automatique femme, collection Espérance.',
  },
  {
    id: '96',
    name: 'Huawei Watch Fit 4 Pro',
    category: 'accessoires',
    subCategory: 'Montres',
    image: 'https://www.cdiscount.com/pdt2/7/2/1/1/400x400/aaavc43721/rw/montre-connectee-huawei-watch-fit-4-pro-ecra.jpg',
    description: 'Écran AMOLED et suivi santé avancé.',
  },
  {
    id: '97',
    name: 'Lunettes Correcteurs Premium',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://www.bonhommealunettes.org/wp-content/uploads/H1-5-caracteristiques-qu_une-bonne-paire-de-lunette-de-vue-doit-avoir-930x608.jpg',
    description: 'Monture de vue haute qualité pour un confort visuel optimal.',
  },
  {
    id: '98',
    name: 'Jean Reno 2019 C3',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://centreoptique.nc/wp-content/uploads/2024/09/SM-H-JEAN-RENO-2019-C3-45-22-148-MONTURE-METAL-BLEU-MAT.jpg',
    description: 'Monture métal bleu mat, design élégant et moderne.',
  },
  {
    id: '99',
    name: 'Arnette Correcteurs AN7208',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://ci.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/00/077913/3.jpg?4065',
    description: 'Style urbain et dynamique pour une vision claire.',
  },
  {
    id: '100',
    name: 'Arnette Correcteurs AN7290U',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://www.wallaceparis.com/wp-content/uploads/2022/03/Wallace_Denfert_STB_C001_2-2.jpg',
    description: 'Monture légère et résistante pour un usage quotidien.',
  },
  {
    id: '101',
    name: 'Arnette Correcteurs AN7287U',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://sn.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/64/120221/1.jpg?7032',
    description: 'Design contemporain alliant confort et style.',
  },
  {
    id: '102',
    name: 'Trio Stationery Optique',
    category: 'optique',
    subCategory: 'Correcteurs',
    image: 'https://cdn.faire.com/fastly/72fb9c9c7c3db2113b9283198a07632b02ad2fb5920a6aa6065214b9240fa109.jpeg?bg-color=FFFFFF&dpr=1&fit=crop&format=jpg&height=720&width=720',
    description: 'Monture classique et robuste pour verres correcteurs.',
  },
  {
    id: '103',
    name: 'Photogrey Style Homme',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://senachat.com/public/uploads/all/s9gvjf1LLCJhHGQt2ijGn1fCOozK7qY1WvLESY2P.jpg',
    description: 'Verres photochromiques s\'adaptant à la lumière.',
  },
  {
    id: '104',
    name: 'Mont Blanc Photogray',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://elegancesenegal.com/wp-content/uploads/2024/05/lunette-mont-blanc-originale.png',
    description: 'Luxe et protection avec verres photochromiques.',
  },
  {
    id: '105',
    name: 'Photogray Blue Cut',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://sn.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/39/916221/1.jpg?1614',
    description: 'Protection contre la lumière bleue et changement de teinte.',
  },
  {
    id: '106',
    name: 'Photogray Diya',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.softtradingsn.com/wp-content/uploads/2024/08/cf4558e1-271c-46ec-a026-6e9b1ddb12ea.jpeg',
    description: 'Style moderne avec verres intelligents.',
  },
  {
    id: '107',
    name: 'Photogray Classic',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://bonkax.com/wp-content/uploads/2023/07/6BBD6E8D-5074-4314-B89E-BB6D09FEF2E5.png',
    description: 'Verres photochromiques pour un confort visuel total.',
  },
  {
    id: '108',
    name: 'Photogray Pia',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.softtradingsn.com/wp-content/uploads/2024/08/dc54bdd1-e907-449a-94d3-f3b57f3718ec.jpeg',
    description: 'Élégance et technologie photochromique.',
  },
  {
    id: '109',
    name: 'Photogrey Pro',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://senachat.com/public/uploads/all/zbAx1fEWrV90wVQQ1QQbjVEHywjQB2Ho0YVYVUDR.jpg',
    description: 'Performance visuelle supérieure en toute circonstance.',
  },
  {
    id: '110',
    name: 'Photogray Original',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://bonkax.com/wp-content/uploads/2023/07/5460568d-8aba-43e6-8c08-d6b36d18b911.jpg',
    description: 'Le classique du changement de teinte automatique.',
  },
  {
    id: '111',
    name: 'Photogrey Urban',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://senachat.com/public/uploads/all/PJVBBDCZ4PQnL80qx2E7L4nEFCke88Tk6ofcQxlj.jpg',
    description: 'Style urbain avec verres s\'adaptant à la luminosité.',
  },
  {
    id: '112',
    name: 'Photogray MKBXI Silver',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://diaytar.com/wp-content/uploads/sn221/lunette-photogray-homme-mkbxi-silver_715_dakar_senegal.png',
    description: 'Monture argentée et verres photochromiques.',
  },
  {
    id: '113',
    name: 'Photogrey Jiji Style',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://pictures-senegal.jijistatic.com/236279_NjIwLTQ2NS1iMzVkMjhiNDhj.webp',
    description: 'Design tendance et protection photochromique.',
  },
  {
    id: '114',
    name: 'Photogray MKBXI Noir',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://diaytar.com/wp-content/uploads/sn221/lunette-photogray-homme-mkbxi-noir_435_dakar_senegal.png',
    description: 'Monture noire classique avec verres intelligents.',
  },
  {
    id: '115',
    name: 'Photogrey Transparent',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://nuvo.sn/wp-content/uploads/2023/10/Transparent-1.jpg',
    description: 'Monture transparente moderne et verres photochromiques.',
  },
  {
    id: '116',
    name: 'Photogray Pia Soft',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://www.softtradingsn.com/wp-content/uploads/2024/08/9920fbd4-cefc-48bc-8c1d-672520abc522.jpeg',
    description: 'Confort et style avec verres à teinte variable.',
  },
  {
    id: '117',
    name: 'Photogrey Jiji Pro',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'https://pictures-senegal.jijistatic.com/236278_NjIwLTQ2NS03MmIyMTk2Yjc0.webp',
    description: 'Protection UV et adaptation lumineuse rapide.',
  },
  {
    id: '118',
    name: 'Photogray Jalisa',
    category: 'optique',
    subCategory: 'Photogrey',
    image: 'http://jalisashop.com/cdn/shop/files/image8.jpg?v=1758414013',
    description: 'Anti-lumière bleue et photochromique pour un confort total.',
  },
  {
    id: '119',
    name: 'Verres Simple Vision',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://www.optoplus.com/assets/images/home/verres-b252928e3069b6605b4960961c292885.jpg',
    description: 'Verres simples pour une correction précise.',
  },
  {
    id: '120',
    name: 'Simple Noir Designer',
    category: 'optique',
    subCategory: 'Simples',
    image: 'https://img.drz.lazcdn.com/static/bd/p/4b6591eee60e7cee9a55b34a6b574262.jpg_720x720q80.jpg',
    description: 'Lunettes de soleil designer au style épuré.',
  },
  {
    id: '121',
    name: 'Lunettes de Soleil Polarized',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://tech-access-dakar.com/wp-content/uploads/2021/10/1634071027052.png',
    description: 'Protection polarisée haute performance pour un confort visuel maximal.',
  },
  {
    id: '122',
    name: 'Lunettes de Soleil Femme Chic',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://chillandlit.tn/99793-large_default/lunettes-de-soleil-femme.jpg',
    description: 'Design élégant et féminin pour une protection solaire stylée.',
  },
  {
    id: '123',
    name: 'Izipizi Sun Black Polarized',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://www.izipizi.com/media/catalog/product/e/f/ef_slmsdpac01_1-izi_d_sun_black_polarized_vue1.jpg?width=1250&height=1350&quality=85&fit=bounds',
    description: 'Le classique Izipizi avec verres polarisés pour une vision sans reflets.',
  },
  {
    id: '124',
    name: 'Lunettes de Soleil Tendance',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://m.media-amazon.com/images/I/51ctqhbV9+L._AC_UY1000_.jpg',
    description: 'Nouvelle collection tendance pour affirmer votre personnalité.',
  },
  {
    id: '125',
    name: 'Lunettes de Soleil Classiques',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://static.actu.fr/uploads/2021/07/adobestock-218645714-960x640.jpeg',
    description: 'Style intemporel offrant une protection UV optimale.',
  },
  {
    id: '126',
    name: 'Lunettes de Soleil Sport UV400',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://m.media-amazon.com/images/I/61nWs9HjHBL._AC_SL1500_.jpg',
    description: 'Monture ultra-légère et protection UV400 pour vos activités sportives.',
  },
  {
    id: '127',
    name: 'Lunettes de Soleil Solaire LPT',
    category: 'optique',
    subCategory: 'Soleil',
    image: 'https://azureyes.com/cdn/shop/files/azur-eyes_modele_couleur.jpg_5.png?v=1760961835&width=3840',
    description: 'Design moderne et protection solaire de qualité supérieure.',
  },
];

const Navbar = ({ onNavigate }: { onNavigate: (item: string) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate('Accueil')}>
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-all duration-500 shadow-lg">N</div>
          <div className="flex flex-col">
            <span className={`font-black text-sm tracking-[0.2em] leading-none transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>NDIGUEL</span>
            <span className={`font-bold text-[10px] tracking-[0.1em] opacity-60 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>OPTIQUE & PRESTIGE</span>
          </div>
        </div>

        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => onNavigate(item)} 
              className={`transition-all hover:tracking-[0.4em] ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              {item}
            </button>
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
                <button 
                  key={item} 
                  onClick={() => { onNavigate(item); setIsMobileMenuOpen(false); }} 
                  className="py-2 hover:text-gray-500"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (item: string) => void }) => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-10"></div>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          src="https://www.qualias-optique.be/img/cms/Lunettes.png" 
          className="w-full h-full object-cover opacity-70" 
          alt="Hero Background" 
        />
      </div>
      
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">L'Art de la Vision & du Prestige</span>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.8]">
            NDIGUEL<br />
            <span className="bg-gradient-to-r from-white via-white/70 to-white/20 bg-clip-text text-transparent">OPTIQUE</span>
          </h1>
          <p className="text-white/60 text-base md:text-2xl mb-14 font-light leading-relaxed max-w-3xl mx-auto tracking-wide">
            L'excellence visuelle rencontre l'innovation technologique. <br className="hidden md:block" /> Découvrez notre sélection exclusive de montures de luxe et d'accessoires de prestige.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button 
              onClick={() => onNavigate('Accessoires')} 
              className="group relative px-14 py-6 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-20 hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span className="relative z-10">Explorer la Collection</span>
              <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={20} />
            </button>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-14 py-6 bg-white/5 backdrop-blur-xl text-white border border-white/10 font-black rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              Service Client
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-6 opacity-30">
        <div className="flex gap-4">
          <a href="https://www.tiktok.com/@ndigueloptique?_r=1&_t=ZN-959OrCK0xPS" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white hover:text-white/100 cursor-pointer transition-colors">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
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
      <div className="container mx-auto px-4">
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
      <div className="container mx-auto px-4">
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
            <img src="https://spacenet.tn/199656-large_default/casque-bluetooth-p9-pro-max-bleu.jpg" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Optique" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="absolute inset-0 border-[20px] border-transparent group-hover:border-white/10 transition-all duration-700 rounded-[4rem]"></div>
            <div className="absolute bottom-16 left-16 right-16">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em] mb-4">Confort Visuel</p>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-8 tracking-tighter leading-none">NDIGUEL<br />OPTIQUE</h3>
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
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Bonjour, je souhaite plus d'informations sur :\n\nProduit : ${product.name}\nPhoto : ${product.image || 'Non disponible'}`)}`}
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
          href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Bonjour, je souhaite commander :\n\nProduit : ${product.name}\nPhoto : ${product.image || 'Non disponible'}`)}`}
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
      <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter mb-8">{title}</h2>
      <div className="w-24 h-1.5 bg-black mx-auto rounded-full"></div>
    </motion.div>
  </div>
);

const Footer = ({ onAdminClick, onNavigate }: { onAdminClick: () => void, onNavigate: (item: string) => void }) => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer" onClick={() => onNavigate('Accueil')}>
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
              {[
                { icon: <Instagram size={20} />, url: "#" },
                { icon: <Facebook size={20} />, url: "#" },
                { icon: <Twitter size={20} />, url: "#" },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                    </svg>
                  ), 
                  url: "https://www.tiktok.com/@ndigueloptique?_r=1&_t=ZN-959OrCK0xPS" 
                }
              ].map((social, i) => (
                <a key={i} href={social.url} target={social.url !== "#" ? "_blank" : undefined} rel={social.url !== "#" ? "noopener noreferrer" : undefined} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-1">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Accessoires', 'Optique', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => onNavigate(item)} 
                    className="text-sm font-bold text-gray-600 hover:text-black transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-black transition-all group-hover:w-4"></span>
                    {item}
                  </button>
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
            © {new Date().getFullYear()} NDIGUEL OPTIQUE. Tous droits réservés.
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
    ? ['Tous', 'Audio', 'Protection', 'Énergie', 'Câbles', 'Studio', 'Montres', 'Informatique', 'Gaming', 'Maison']
    : ['Tous', 'Correcteurs', 'Photogrey', 'Simples', 'Soleil', 'Antireflet'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = p.category === activeTab;
    const matchesSubCategory = selectedSubCategory === 'Tous' || p.subCategory === selectedSubCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  const handleNavigate = (item: string) => {
    if (item === 'Accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Accessoires') {
      setActiveTab('accessoires');
      setSelectedSubCategory('Tous');
      const element = document.getElementById('products-section');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Optique') {
      setActiveTab('optique');
      setSelectedSubCategory('Tous');
      const element = document.getElementById('products-section');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Contact') {
      const element = document.getElementById('contact');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Navbar onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <Features />
      <CategoryShowcase onSelect={(cat) => {
        setActiveTab(cat);
        const element = document.getElementById('products-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <section className="py-32 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">L'Héritage NDIGUEL</h2>
            <h3 className="text-2xl md:text-4xl lg:text-7xl font-black mb-12 tracking-tighter leading-none">
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

      <main id="products-section" className="container mx-auto px-4 pb-24 scroll-mt-24">
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
              NDIGUEL OPTIQUE
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
            title={activeTab === 'accessoires' ? "Accessoires Premium" : "NDIGUEL OPTIQUE"} 
            subtitle={activeTab === 'accessoires' ? "Technologie & Style" : "Vision & Prestige"} 
          />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeTab}-${selectedSubCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
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

      <Footer onAdminClick={() => setShowLogin(true)} onNavigate={handleNavigate} />

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
