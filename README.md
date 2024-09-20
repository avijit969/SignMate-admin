# SignMate-admin

**SignMate-admin** is the admin panel for the **SignMate** project, developed as part of the Smart India Hackathon (SIH). This admin interface allows administrators to manage users, content, and other crucial data for the SignMate learning platform.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Features

1. **User Management**:
   - Add, remove, and manage users who access the SignMate platform.
   
2. **Content Management**:
   - Create, update, and delete learning modules, quizzes, and multimedia resources (videos, images, etc.).
   
3. **Progress Monitoring**:
   - View and track user progress, including quiz results and lesson completions.
   
4. **Analytics**:
   - Provides detailed analytics and reports on platform usage.

5. **Responsive Interface**:
   - Fully responsive interface optimized for desktops and tablets.

---

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/docs/cli) (optional for deployment)

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/avijit969/SignMate-admin.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd SignMate-admin
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Create a `.env` file** and configure your environment variables (Supabase, API keys, etc.):
    ```bash
    SUPABASE_URL=your-supabase-url
    SUPABASE_KEY=your-supabase-key
    ```

5. **Run the development server**:
    ```bash
    npm run dev
    ```

6. **Open the application**:
    - Visit `http://localhost:3000` in your browser.

---

## Usage

1. **Login to the Admin Panel**:
   Use the credentials to log in to the admin panel.

2. **Manage Users**:
   View, add, or remove users from the system.

3. **Create and Edit Content**:
   Use the content management system to add new lessons or quizzes, and update existing materials.

4. **Monitor Progress**:
   Access the progress dashboard to track user activity and performance.

---

## Technologies Used

- **React.js**: Frontend framework.
- **Vite**: Fast build tool for development.
- **Tailwind CSS**: For styling the application.
- **Supabase**: Provides database and authentication services.
- **Vercel**: For deployment.

---

## Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bug fix.
3. **Commit your changes**.
4. **Submit a pull request**.

Please ensure your code follows the project's guidelines and is well-documented.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, reach out to the project maintainers:

- **Email**: abhijitpradhan9@gmail.com
- **Website**: [SignMate-admin](https://sign-mate-admin.vercel.app)