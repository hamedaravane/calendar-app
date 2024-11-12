# Angular Calendar and Appointment Scheduler

An interactive calendar application built with **Angular 18.2.11**, designed to schedule and manage appointments efficiently. The application supports Day, Week, and Month views, allowing users to create, edit, and delete appointments seamlessly. With drag-and-drop functionality, users can easily reschedule appointments across different time slots and dates. Developed as part of a technical task for **Payever Company** interview, this project showcases expertise in Angular, TypeScript, and front-end development best practices.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Technical Implementation](#technical-implementation)
- [About the Developer](#about-the-developer)
- [Contact Information](#contact-information)

## Project Overview

This application meets all the specified requirements and demonstrates the use of various Angular features and best practices.

## Features

- **Multiple Calendar Views**: Switch between Day, Week, and Month views for flexible scheduling.
- **Appointment Management**: Create, edit, and delete appointments with ease.
- **Drag-and-Drop Rescheduling**: Move appointments across time slots and dates using intuitive drag-and-drop functionality powered by Angular CDK.
- **Dynamic Time Zone Display**: Automatically displays the user's time zone offset.
- **Responsive Design**: Optimized for various screen sizes, ensuring usability on all devices.
- **Validation and Error Handling**: Ensures end times are after start times and provides user feedback for invalid inputs.
- **Enhanced UI with Angular Material**: Utilizes Angular Material components for a polished and accessible user interface.
- **Lazy Loading and Routing**: Implements lazy-loaded modules and routing for efficient performance.
- **Reactive Forms and RxJS**: Uses reactive forms with value changes and validators, leveraging RxJS for reactive programming.

## Technologies Used

- **Angular 18.2.11**
- **TypeScript**
- **Angular Material**
- **Angular CDK (Drag & Drop)**
- **RxJS**
- **SCSS for styling**
- **HTML5**
- **ESLint for linting**

## Usage

- **Navigate Between Views**: Use the header controls to switch between Day, Week, and Month views.
- **Create an Appointment**: Click on a time slot (Day/Week view) or a date cell (Month view) to open the appointment form.
- **Edit an Appointment**: Click on an existing appointment to modify its details.
- **Delete an Appointment**: Click the delete icon on an appointment and confirm the action.
- **Drag and Drop**: Click and hold an appointment to drag it to a new time slot or date.

## Technical Implementation

### Angular Features and Patterns Used

- **Dependency Injection**: Utilized throughout the application for services and components.
- **Lazy Loading**: Modules and routes are lazy-loaded to improve performance.
- **Routing**: Implemented with `RouterModule` and `router-outlet` for navigation.
- **Reactive Forms**: Used `FormGroup`, `FormControl`, and validators for the appointment form.
- **Value Changes and Validators**: Dynamic form validation and updates based on user input.
- **RxJS**: Employed for reactive programming, including observables and operators like `pipe` and `subscribe`.
- **Standalone Components**: Leveraged Angular's standalone component feature for modularity.
- **Angular Material and CDK**: Used for UI components and implementing Drag & Drop functionality.
- **NgFor and NgIf Directives**: Rendered calendar dates and appointments dynamically.
- **Date Handling with Date()**: Managed dates and times using JavaScript's `Date` object.

### Project Structure

- **Components**:
  - `calendar-view`: Main component handling the calendar display and interactions.
  - `appointment-form`: Dialog component for creating and editing appointments using reactive forms.
  - `header`: Component for navigation controls and date selection.
  - `confirmation-dialog`: Component for delete confirmations.
- **Services**:
  - `appointment.service.ts`: Manages appointment data and state across the application, using observables.
- **Models**:
  - `appointment.entity.ts`: Defines the `Appointment` and `AppointmentData` interfaces.
- **Routing**:
  - Configured with lazy-loaded modules and routes to enhance performance.
- **Forms and Validation**:
  - Implemented with reactive forms, custom validators, and value change subscriptions.
- **Drag & Drop**:
  - Implemented using Angular CDK's Drag & Drop module for moving appointments.
- **Linting and Code Quality**:
  - Configured ESLint to enforce code standards, ensuring the project passes all linting rules.

### Compliance with Technical Task Requirements

- **Project passes ESLint**: Ensured code quality and adherence to standards.
- **Builds and Serves Successfully**: The application builds without errors and runs as expected.
- **Appointment Creation**: Users can create appointments via a form.
- **Drag & Drop Functionality**: Appointments can be moved using mouse drag and drop, implemented with Angular CDK.
- **Angular Patterns Implemented**:
  - **Lazy Loading**: Modules and routes are lazy-loaded.
  - **Routing**: Implemented with `router-outlet` and navigable routes.
  - **Forms**: Used reactive forms with validators and value changes.
  - **RxJS**: Leveraged for state management and reactive programming.
  - **Standalone Components**: Used to enhance modularity and reusability.
  - **Angular Material and CDK**: Used for UI components and drag & drop.

## About the Developer

### **Hamed Arghavan**

Front-End Developer passionate about crafting engaging and user-friendly web experiences. With over 5 years of experience, I specialize in building responsive and mobile-first applications that prioritize user needs and business goals. Proficient in modern web technologies, I excel at transforming designs into interactive, high-performance interfaces. Known for a collaborative approach, problem-solving skills, and commitment to best practices in web development.

#### **Skills**

- Angular framework
- TypeScript
- JavaScript
- HTML5 and CSS3
- Responsive web design
- Agile methodologies (Scrum)
- NestJS
- RESTful API integration
- Accessibility and usability best practices
- Unit and integration testing (Jest)
- CSS preprocessors (Sass)
- Git version control

#### **Experience**

- **OMP Finex** - *Front-End Developer*  
  *Mashhad, Iran | Sep 2022 - Present*
  - Led the development of the KYC domain, implementing complex features like camera access and video recording.
  - Optimized the landing page using Svelte 5 and Astro, achieving load times up to 30% faster than competitors.
  - Implemented best practices in TypeScript, focusing on language features over frameworks.
  - Applied SOLID principles and Domain-Driven Design (DDD) architecture.
  - Designed and developed a custom design system using SASS.
  - Collaborated closely with back-end and design teams.

- **Aran Accelerator** - *Front-End Developer*  
  *Mashhad, Iran | Sep 2019 - Aug 2022*
  - Developed foundational web applications using HTML, CSS, JavaScript, and TypeScript.
  - Assisted in creating responsive web designs with a mobile-first approach.
  - Utilized SASS/SCSS and LESS for efficient and maintainable styling.
  - Collaborated with senior developers to integrate RESTful APIs.
  - Participated in Agile team meetings and code reviews.

#### **Education**

- **Bachelor's Degree in Software Engineering**  
  *Khayyam University, Mashhad, Iran | 2013 - 2018*

#### **Articles**

- **[Rethinking Software Architecture: Balancing Simplicity and Maintainability](https://medium.com/@hamedaravane/rethinking-software-architecture-balancing-simplicity-and-maintainability-b59483d4c60d)**  
  *Medium | June 8, 2024*
  - Discussed challenges in choosing the right application structure in Angular development.
  - Emphasized balancing simplicity, maintainability, and complexity.
  - Advocated for a modular, domain-driven architecture aligned with business needs.
  - Provided a practical guide for structuring an e-commerce application.

#### **Personal Projects**

- **[Hey Lee — Inventory Management and Accounting Application](http://github.com/hamedaravane/heylee-front)**
  - Developed an Angular-based application to streamline inventory management and accounting for small online stores.
  - **Technologies**: Angular 18, NestJs, TypeScript, Ant Design, Tailwind CSS, RxJS.
  - Led the full-stack development and deployment of the application.
  - Designed intuitive user interfaces, enhancing user experience and accessibility.
  - Implemented real-time inventory checks and streamlined order processing.
  - Optimized application performance and ensured scalability.

## Contact Information

- **Name**: Hamed Arghavan
- **Location**: Mashhad, Iran
- **Phone**: +98 901 770 1599
- **Email**: [hamedaravane@gmail.com](mailto:hamedaravane@gmail.com)
- **LinkedIn**: [linkedin.com/in/aboutcolorpurple](https://linkedin.com/in/aboutcolorpurple)
