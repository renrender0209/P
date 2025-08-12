#!/bin/bash
echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies and build
echo "Installing client dependencies..."
cd client
npm install

echo "Building client..."
npm run build

echo "Build completed successfully!"
cd ..