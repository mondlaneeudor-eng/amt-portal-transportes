import transporteEscolar from "../assets/images/transporte-escolar.jpg";
import transporteBmm from "../assets/images/transporte-bmm.jpg";
import transportesMunicipais from "../assets/images/transportes-municipais.jpg";
import transporteIntermodal from "../assets/images/transporte-intermodal.jpg";

export type IconType = "bus" | "train";

export interface ServiceOption {
  label: string;
  href: string;
}

export interface ServiceConfig {
  id: string;
  title: string;
  extraInfo?: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: IconType;
  iconBg: string;
  /** Direct external destination. Omit when the service uses `options` instead. */
  href?: string;
  /** When present, "Aceder ao sistema" opens a selection dialog instead of navigating directly. */
  options?: ServiceOption[];
}

export const services: ServiceConfig[] = [
  {
    id: "transporte-escolar",
    title: "Transporte Escolar",
    description: "Monitoria da frota e das operações escolares",
    image: transporteEscolar,
    imageAlt:
      "Fila de autocarros escolares amarelos estacionados ao ar livre",
    icon: "bus",
    iconBg: "var(--amt-icon-bg-yellow)",
    href: "https://baza.paytech.tech",
  },
  {
    id: "transporte-bmm",
    title: "Transporte BMM",
    description: "Gestão e monitoria dos autocarros BMM",
    image: transporteBmm,
    imageAlt: "Autocarro articulado da operadora BMM Metro",
    icon: "bus",
    iconBg: "var(--amt-icon-bg-mint)",
    href: "https://www.autotraklive.com",
  },
  {
    id: "transportes-municipais",
    title: "Transportes Municipais",
    extraInfo: "100 autocarros · zonas Centro e Norte",
    description: "Acompanhamento da operação municipal",
    image: transportesMunicipais,
    imageAlt: "Autocarros municipais verdes e brancos alinhados",
    icon: "bus",
    iconBg: "var(--amt-icon-bg-blue)",
    options: [
      { label: "Gestão de Activos", href: "https://assetmanagement.vm.co.mz" },
      { label: "Relatórios", href: "https://assetreportes.vm.co.mz" },
    ],
  },
  {
    id: "transporte-intermodal",
    title: "Transporte Intermodal",
    description: "Integração e monitoria dos serviços intermodais",
    image: transporteIntermodal,
    imageAlt: "Comboio de passageiros verde e branco numa estação",
    icon: "train",
    iconBg: "var(--amt-icon-bg-yellow)",
    href: "https://www.7-24Telematics.com",
  },
];
