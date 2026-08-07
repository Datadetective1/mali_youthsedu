import type { MetadataRoute } from 'next';
import { brand } from '@/config';

/**
 * Web app manifest. Generated rather than static so the brand name — which the
 * brief says may change — comes from configuration like everywhere else.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.shortName,
    description:
      'Parcours de compétences et préparation à l’emploi pour la jeunesse malienne. En français, sur mobile, utilisable hors ligne.',
    start_url: '/tableau-de-bord',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf9f7',
    theme_color: '#124d3e',
    lang: 'fr',
    dir: 'ltr',
    categories: ['education', 'productivity'],
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Plan de la semaine', short_name: 'Ma semaine', url: '/plan-semaine' },
      { name: 'Préparation à l’emploi', short_name: 'Emploi', url: '/preparation-emploi' },
    ],
  };
}
