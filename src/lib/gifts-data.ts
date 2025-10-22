import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Gift = {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  contributedAmount: number;
  image: ImagePlaceholder | undefined;
};

export const AllGifts: Gift[] = [
  {
    id: "gift-paris-dinner",
    name: "Jantar Romântico em Paris",
    description: "Uma noite inesquecível na cidade do amor, com vista para a Torre Eiffel.",
    totalPrice: 500.00,
    contributedAmount: 150.00, // Example of a partially funded gift
    image: PlaceHolderImages.find(p => p.id === 'gift-paris-dinner'),
  },
  {
    id: "gift-venice-gondola",
    name: "Passeio de Gôndola em Veneza",
    description: "Navegue pelos canais de Veneza em um passeio romântico.",
    totalPrice: 300.00,
    contributedAmount: 0,
    image: PlaceHolderImages.find(p => p.id === 'gift-venice-gondola'),
  },
  {
    id: "gift-maldives-hotel",
    name: "Diária em Hotel nas Maldivas",
    description: "Ajude-nos a ficar em um bangalô sobre as águas cristalinas das Maldivas.",
    totalPrice: 1000.00,
    contributedAmount: 1000.00, // Example of a fully funded gift
    image: PlaceHolderImages.find(p => p.id === 'gift-maldives-hotel'),
  },
  {
    id: "gift-tuscany-cooking",
    name: "Aulas de Culinária na Toscana",
    description: "Para aprendermos juntos os segredos da cozinha italiana.",
    totalPrice: 400.00,
    contributedAmount: 0,
    image: PlaceHolderImages.find(p => p.id === 'gift-tuscany-cooking'),
  },
  {
    id: "gifts-cookware",
    name: "Jogo de Panelas Premium",
    description: "Para prepararmos jantares deliciosos em nossa nova casa.",
    totalPrice: 800.00,
    contributedAmount: 250.00,
    image: PlaceHolderImages.find(p => p.id === 'gifts-cookware'),
  },
  {
    id: "gift-espresso-machine",
    name: "Cafeteira Espresso",
    description: "Para manhãs mais saborosas e cheias de energia.",
    totalPrice: 600.00,
    contributedAmount: 0,
    image: PlaceHolderImages.find(p => p.id === 'gift-espresso-machine'),
  },
  {
    id: "gift-air-fryer",
    name: "Air Fryer",
    description: "Para refeições mais práticas e saudáveis no dia a dia.",
    totalPrice: 450.00,
    contributedAmount: 0,
    image: PlaceHolderImages.find(p => p.id === 'gift-air-fryer'),
  },
  {
    id: "gift-tool-kit",
    name: "Kit de Ferramentas",
    description: "Para pequenos reparos e projetos em nosso lar.",
    totalPrice: 250.00,
    contributedAmount: 100.00,
    image: PlaceHolderImages.find(p => p.id === 'gift-tool-kit'),
  },
];
