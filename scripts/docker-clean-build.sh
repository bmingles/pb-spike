pb_data_dir=$(dirname "$0")/../pb_data

echo "Removing $pb_data_dir..."
rm -rf $pb_data_dir

echo "Building and running pb-kmt container..."
docker compose up pb-kmt --build