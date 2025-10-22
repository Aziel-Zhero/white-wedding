import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Gift = {
  name: string;
  description: string;
  price: string;
  link: string;
  image: ImagePlaceholder | undefined;
};

export const AllGifts: Gift[] = [
  {
    name: "Jantar Romântico em Paris",
    description: "Uma noite inesquecível na cidade do amor, com vista para a Torre Eiffel.",
    price: "R$ 500,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-paris-dinner'),
  },
  {
    name: "Passeio de Gôndola em Veneza",
    description: "Navegue pelos canais de Veneza em um passeio romântico.",
    price: "R$ 300,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-venice-gondola'),
  },
  {
    name: "Diária em Hotel nas Maldivas",
    description: "Ajude-nos a ficar em um bangalô sobre as águas cristalinas das Maldivas.",
    price: "R$ 1.000,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-maldives-hotel'),
  },
  {
    name: "Aulas de Culinária na Toscana",
    description: "Para aprendermos juntos os segredos da cozinha italiana.",
    price: "R$ 400,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-tuscany-cooking'),
  },
  {
    name: "Jogo de Panelas Premium",
    description: "Para prepararmos jantares deliciosos em nossa nova casa.",
    price: "R$ 800,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gifts-cookware'),
  },
  {
    name: "Cafeteira Espresso",
    description: "Para manhãs mais saborosas e cheias de energia.",
    price: "R$ 600,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-espresso-machine'),
  },
  {
    name: "Air Fryer",
    description: "Para refeições mais práticas e saudáveis no dia a dia.",
    price: "R$ 450,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-air-fryer'),
  },
  {
    name: "Kit de Ferramentas",
    description: "Para pequenos reparos e projetos em nosso lar.",
    price: "R$ 250,00",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gift-tool-kit'),
  },
];
