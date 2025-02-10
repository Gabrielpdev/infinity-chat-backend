# Infinity Chat Backend

This is the backend part of the Infinity Chat project.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gabrielpdev/infinity-chat.git
   cd infinity-chat/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Make sure MongoDB is running on your machine or use a MongoDB cloud service.

```bash
npm run dev
# or
yarn dev
```

The backend server will start on [http://localhost:5000](http://localhost:5000).

### Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following environment variables:

If you dont know how to create a mongoDB URI, follow this instructions https://www.mongodb.com/pt-br/docs/guides/atlas/account/

```
MONGO_URI=[your_mongo_db_uri]
PORT=5000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000 // your frontend url

```

## Learn More

To learn more about Express.js, take a look at the following resources:

- [Express.js Documentation](https://expressjs.com/) - learn about Express.js features and API.
- [Mongoose Documentation](https://mongoosejs.com/) - learn about Mongoose features and API.
