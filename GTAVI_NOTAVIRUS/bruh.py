import struct
from PIL import Image

# Encode an image to .bruh format
def encode_to_bruh(image_path, output_path):
    # Open the image
    img = Image.open(image_path)
    img = img.convert("RGB")  # Ensure it's in RGB format
    width, height = img.size

    # Prepare the header (width and height as 4-byte integers)
    header = struct.pack("II", width, height)

    # Prepare the pixel data (flattened list of RGB values)
    pixels = list(img.getdata())
    pixel_data = b"".join(struct.pack("BBB", *pixel) for pixel in pixels)

    # Write to .bruh file
    with open(output_path, "wb") as f:
        f.write(header)
        f.write(pixel_data)

    print(f"Image saved as {output_path}")

# Decode a .bruh file to an image
def decode_from_bruh(bruh_path, output_path):
    with open(bruh_path, "rb") as f:
        # Read the header (width and height)
        header = f.read(8)  # 4 bytes for width, 4 bytes for height
        width, height = struct.unpack("II", header)

        # Read the pixel data
        pixel_data = f.read()
        pixels = [struct.unpack("BBB", pixel_data[i:i+3]) for i in range(0, len(pixel_data), 3)]

        # Create a new image
        img = Image.new("RGB", (width, height))
        img.putdata(pixels)
        img.save(output_path)

    print(f"Image decoded and saved as {output_path}")

# Example usage
if __name__ == "__main__":
    # Encode an image to .bruh
    encode_to_bruh("input/Image-1.jpeg", "output/output_image.bruh")

    # Decode the .bruh file back to an image
    decode_from_bruh("output/output_image.bruh", "output/decoded_image.png")