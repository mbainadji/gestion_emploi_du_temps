# Gestion Emploi du Temps - Université de Yaoundé I

Application de gestion des emplois du temps universitaires pour la Faculté des Sciences, Département d'Informatique.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mbainadjis-projects/v0-university-schedule-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/gDrOfL2zko2)

## Fonctionnalités

- **Consultation des emplois du temps** par classe, enseignant, salle
- **Affichage visuel** sous forme de grille hebdomadaire
- **Données ICT4D-ICTL2** Semestre 1, Année Académique 2025-2026

## Structure du Projet

```
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── timetable/         # Pages emploi du temps
│   ├── teachers/          # Liste des enseignants
│   ├── courses/           # Liste des cours
│   └── rooms/             # Liste des salles
├── components/            # Composants React
├── lib/                   # Données et utilitaires
└── database/              # Script SQL pour MySQL
```

## Installation Locale

### Option 1: Application Web (Next.js)

```bash
# Cloner le repository
git clone https://github.com/votre-repo/gestion_emploi_du_temps.git
cd gestion_emploi_du_temps

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Option 2: Base de données MySQL

Pour utiliser avec une vraie base de données MySQL:

```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script SQL complet
source database/university_schedule_complete.sql
```

**Nom de la base:** `university_schedule`

**Comptes de test:**
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@univ-yaounde1.cm | admin123 |
| Enseignant | monthe@univ-yaounde1.cm | teacher123 |

## Enseignants ICT-L2

- MONTHE, EONE, KWETTE, MUSIMA
- NKONDOCK, MOSSEBO, MBOUS, SEVANY
- NKOUANDOU, BIYONG, VIDEME, EKONO

## Cours (UE) Semestre 1

| Code | Intitulé | Crédits |
|------|----------|---------|
| ICT201 | Programmation Orientée Objet | 6 |
| ICT203 | Bases de Données | 6 |
| ICT205 | Réseaux Informatiques | 6 |
| ICT207 | Systèmes d'Exploitation | 6 |
| ICT213 | Algorithmique Avancée | 6 |
| ICT215 | Développement Web | 6 |
| ICT217 | Génie Logiciel | 6 |
| ENG203 | Anglais Technique | 3 |
| FRA203 | Techniques d'Expression | 3 |

## Déploiement

Ce projet est automatiquement déployé sur Vercel:
**[https://vercel.com/mbainadjis-projects/v0-university-schedule-app](https://vercel.com/mbainadjis-projects/v0-university-schedule-app)**

## Licence

Université de Yaoundé I - Faculté des Sciences
