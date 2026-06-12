# খতমে নবুওয়াত ফাউন্ডেশন — স্বেচ্ছাসেবী ও রক্তদাতা ড্যাশবোর্ড

![Khatme Nubuwwat Foundation Dashboard Banner](./src/assets/banner.png)

A modern, highly-responsive, and feature-rich **Volunteer and Blood Donor Dashboard** built for **Khatme Nubuwwat Foundation** (খতমে নবুওয়াত ফাউন্ডেশন). It connects dynamically to a Google Spreadsheet to process, filter, and visualize volunteer registration details and blood donor statistics.

---

## 🌟 Key Features

- **⚡ Real-Time Google Sheets Sync**: Fetches registration submissions instantly from the Google Sheets API without requiring a custom database backend.
- **📊 Dynamic Stats Counter**: Tracks essential indices:
  - Total Registered Members
  - Active & Emergency Blood Donors
  - Platelet (Apheresis) Donors
  - Unique Registered Blood Groups
  - Diverse Professions
- **🩸 Interactive Blood Donor Grid**: A visual breakdown of blood group counts. Clicking any blood group card toggles it as an active filter.
- **💼 Profession Distribution Chart**: Dynamically computes and displays a responsive bar chart of the top 7 professions among the registered volunteers.
- **🔍 Premium Search & Filtering**: Multi-criteria filters let users search by **Name, Mobile Number, or Area**, or filter by **Blood Group**, **Profession**, and **Volunteer Category** simultaneously.
- **👥 Paginated Volunteer Table**: Clean table layout featuring tags for skills, blood group badges, and quick-action detail buttons.
- **👤 Detailed Profile Modal**: Opens a comprehensive, beautifully structured overlay displaying the full form submission (Parents' names, permanent address, WhatsApp, educational credentials, and emergency contact details).

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 5](https://vite.dev/)
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts (`Hind Siliguri` & `Noto Serif Bengali`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v20.19+ or v22.12+ recommended) and **npm** installed on your system.

### Installation

1. Clone or download the repository into your workspace:
   ```bash
   cd "Form Dashboard"
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To compile and optimize the app for production deployment:
```bash
npm run build
```
The compiled, ready-to-deploy static assets will be located in the `dist/` directory.

---

## ⚙️ Configuration & Customization

The spreadsheet configuration is managed at the top of [src/App.jsx](file:///x:/knf/Form%20Dashboard/src/App.jsx):

```javascript
const SHEET_ID = '1tAs1zh6RKEtZSL088KXKl9iZ1mD-Di8Zz88eDBZtRJs';
const SHEET_NAME = 'Form Responses 1';
```

- **`SHEET_ID`**: The unique identifier of your Google Spreadsheet (found in the spreadsheet's URL).
- **`SHEET_NAME`**: The exact tab name containing the form responses (e.g., `'Form Responses 1'`).

> [!IMPORTANT]
> Make sure the Google Spreadsheet is shared as **"Anyone with the link can view"** (Viewer mode). Otherwise, the dashboard will fail to fetch the data due to permission restrictions.

---

## 📱 Responsive Layout Support

The dashboard features full responsive design support using Tailwind breakpoints:
- **Desktop (1024px+)**: Dual-column chart panels and full-column table layouts.
- **Tablet (768px - 1024px)**: Compressed metrics cards and optimized layout.
- **Mobile (320px - 768px)**: Flex-stacked stats grid, swipeable filters, and hidden columns in the main table to maximize space, with full profiles still accessible via the **বিস্তারিত** details modal.
