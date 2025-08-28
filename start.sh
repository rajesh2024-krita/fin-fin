
#!/bin/bash

# Install .NET 8 SDK if not available
if ! command -v dotnet &> /dev/null; then
    echo "Installing .NET 8 SDK..."
    nix-env -iA nixpkgs.dotnet-sdk_8
fi

# Restore backend dependencies
echo "Restoring backend dependencies..."
cd Backend && dotnet restore

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../Frontend && npm install

echo "Setup complete! You can now run the application."
