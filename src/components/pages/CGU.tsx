// src/components/pages/CGU.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const cguContent: Record<string, { title: string; items: { title: string; description: string }[] }> = {
  fr: {
    title: 'Conditions Générales d\'Utilisation',
    items: [
      { title: 'Respect de la propriété intellectuelle', description: 'Les utilisateurs s\'engagent à respecter les droits de propriété intellectuelle. Aucun contenu protégé ne doit être partagé ou utilisé sans autorisation préalable.' },
      { title: 'Contenu inapproprié', description: 'La diffusion de contenu illégal, offensant, diffamatoire, discriminatoire ou portant atteinte aux droits d\'autrui est strictement interdite.' },
      { title: 'Protection des données personnelles', description: 'Aucune donnée personnelle n\'est collectée à des fins commerciales. Les informations éventuellement stockées sont destinées au bon fonctionnement du service et ne sont ni revendues, ni partagées à des tiers.' },
      { title: 'Utilisation légale du service', description: 'Le service doit être utilisé dans le respect des lois et règlements applicables. Tout usage illicite entraînera une suspension immédiate.' },
      { title: 'Respect et bienveillance', description: 'Les utilisateurs doivent faire preuve de respect et de bienveillance envers les autres membres de la communauté.' },
      { title: 'Limitations du service', description: 'Le service est fourni "tel quel", sans garantie de disponibilité, de performance ou d\'absence d\'erreurs. Aucune responsabilité ne sera engagée en cas d\'interruption ou de perte de données.' },
      { title: 'Modifications des présentes CGU', description: 'Les CGU peuvent être modifiées à tout moment pour tenir compte de l\'évolution du service ou des exigences légales. Les utilisateurs seront invités à consulter régulièrement les conditions en vigueur.' },
      { title: 'Suspension ou résiliation de l\'accès', description: 'Le propriétaire du service se réserve le droit de suspendre ou de résilier l\'accès d\'un utilisateur en cas de non-respect des présentes conditions.' },
      { title: 'Support et contact', description: 'Un support limité est proposé. Pour toute demande, les utilisateurs peuvent contacter l\'administrateur du service par e-mail.' },
      { title: 'Résolution des litiges', description: 'En cas de différend, une solution amiable sera recherchée en priorité avant toute action judiciaire.' },
    ],
  },
  en: {
    title: 'Terms of Use',
    items: [
      { title: 'Respect of Intellectual Property', description: 'Users must respect intellectual property rights. No protected content may be shared or used without prior authorization.' },
      { title: 'Inappropriate Content', description: 'The distribution of illegal, offensive, defamatory, discriminatory or infringing content is strictly prohibited.' },
      { title: 'Protection of Personal Data', description: 'No personal data is collected for commercial purposes. Any stored information is intended for the proper functioning of the service and is neither sold nor shared with third parties.' },
      { title: 'Legal Use of the Service', description: 'The service must be used in compliance with applicable laws and regulations. Any unlawful use will result in immediate suspension.' },
      { title: 'Respect and Kindness', description: 'Users must demonstrate respect and kindness towards other community members.' },
      { title: 'Service Limitations', description: 'The service is provided "as is", without guarantee of availability, performance, or error-free operation. No liability is accepted for interruptions or data loss.' },
      { title: 'Changes to These Terms', description: 'The Terms of Use may be modified at any time to reflect service changes or legal requirements. Users are encouraged to regularly review the current terms.' },
      { title: 'Suspension or Termination of Access', description: 'The service owner reserves the right to suspend or terminate a user\'s access in case of violation of these terms.' },
      { title: 'Support and Contact', description: 'Limited support is offered. For any inquiries, users can contact the service administrator by email.' },
      { title: 'Dispute Resolution', description: 'In the event of a dispute, an amicable solution will be sought before any legal action.' },
    ],
  },
};

export const CGU: React.FC = () => {
  const navigate = useNavigate();
  const language = navigator.language.slice(0, 2);
  const { title, items } = cguContent[language] || cguContent['fr'];

  return (
    <Box p={4} maxWidth="800px" mx="auto" className="scrollable-container">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {items.map((item, index) => (
        <Box key={index} mb={3}>
          <Typography variant="h6" gutterBottom>
            {index + 1}. {item.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {item.description}
          </Typography>
        </Box>
      ))}

      <Box mt={6} display="flex" justifyContent="center">
        <Button variant="contained" onClick={() => navigate('/')}>
          {language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
        </Button>
      </Box>
    </Box>
  );
};
