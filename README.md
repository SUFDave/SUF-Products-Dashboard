# SUF Products Dashboard

Real-time inventory management dashboard for tracking product stock levels across categories. Automatically syncs with your e-commerce platform and provides instant visibility into stock levels, low stock alerts, and category-based analytics.

## Features

- **Real-time Stock Monitoring**: Live updates from your e-commerce platform
- **Category-Based Filtering**: Filter products by SEATING, DESKS, STORAGE, TABLES, ACCESSORIES, LIGHTING, and more
- **Low Stock Alerts**: Automatic alerts for products running low or out of stock
- **Visual Analytics**: Charts and graphs showing inventory distribution by category
- **Firebase Integration**: Scalable cloud infrastructure with Firestore and Cloud Functions
- **Responsive Dashboard**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

### Frontend (Dashboard)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Firebase SDK** for real-time data

### Backend (Functions)
- **Firebase Cloud Functions** with TypeScript
- **Firestore** for data storage
- **Scheduled Functions** for automatic sync
- **REST API** endpoints for manual operations

## Project Structure

```
inventory-dashboard/
├── functions/                      # Firebase Functions (Backend)
│   ├── src/
│   │   ├── data/
│   │   │   └── categories.ts      # Product categories definition
│   │   ├── services/
│   │   │   ├── ecommerceService.ts   # E-commerce API integration
│   │   │   ├── inventoryService.ts   # Firestore operations
│   │   │   ├── categoryService.ts    # Category statistics
│   │   │   └── alertService.ts       # Low stock alerts
│   │   ├── types/
│   │   │   └── product.ts         # TypeScript interfaces
│   │   └── index.ts               # Cloud Functions exports
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
├── dashboard/                      # React Dashboard (Frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx      # Main dashboard component
│   │   │   ├── StatsCards.tsx     # Statistics cards
│   │   │   ├── ProductTable.tsx   # Sortable product table
│   │   │   ├── CategoryFilter.tsx # Category filter buttons
│   │   │   ├── CategoryChart.tsx  # Inventory charts
│   │   │   └── LowStockAlerts.tsx # Alert notifications
│   │   ├── lib/
│   │   │   └── firebase.ts        # Firebase configuration
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── deploy-functions.yml    # CI/CD for Functions
├── firestore.rules                 # Security rules
├── firebase.json                   # Firebase configuration
├── .env.example                    # Environment variables template
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- E-commerce platform with API access (Shopify, WooCommerce, etc.)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SUF-Products-Dashboard
```

### 2. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see `.env.example` for required variables)

### 4. Install Dependencies

```bash
# Install Functions dependencies
cd functions
npm install

# Install Dashboard dependencies
cd ../dashboard
npm install
```

### 5. Deploy Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

### 6. Run Dashboard Locally

```bash
cd dashboard
npm run dev
```

The dashboard will open at `http://localhost:3000`

### 7. Deploy Dashboard

```bash
cd dashboard
npm run build
firebase deploy --only hosting
```

## Usage

### Automatic Sync

Firebase Functions automatically sync products from your e-commerce platform every hour, updating inventory levels and creating low stock alerts.

### Manual Sync

Trigger a manual sync via HTTP endpoint:

```bash
curl -X POST https://us-central1-YOUR_PROJECT.cloudfunctions.net/syncProductsManual
```

### Dashboard Features

- **Stats Cards**: View total products, inventory, low stock, and out of stock items
- **Category Filter**: Filter products by category
- **Product Table**: Sortable, searchable table with color-coded inventory levels
- **Low Stock Alerts**: Real-time alerts for products needing attention
- **Category Chart**: Visual inventory distribution across categories

## Firestore Structure

### Collections

**products/** - Product inventory data
**alerts/** - Low stock and out of stock alerts
**inventoryUpdates/** - Historical inventory changes

See full schema details in the complete README section above.

## Security

Firestore security rules ensure:
- Products are read-only from the dashboard
- Only Cloud Functions can write to collections
- Customize for authentication if needed

## CI/CD

GitHub Actions automatically deploys Firebase Functions when changes are pushed to `main` branch.

Configure secrets:
- `FIREBASE_TOKEN`: Generate with `firebase login:ci`
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
