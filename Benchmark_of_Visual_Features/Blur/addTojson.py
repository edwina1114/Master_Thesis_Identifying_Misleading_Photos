import json
import os
import cv2
import numpy as np

path = "/Users/edwina/Desktop/Blur/FormalPics"  # mac
json_path = "/Users/edwina/Desktop/Blur/predictions.json"
exclude_file = ".DS_Store"
threshold_value = 180.21469471928583  # Set the threshold for blur detection


def detect_blur_fft(image, threshold):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Calculate the 2D Discrete Fourier Transform
    fft = np.fft.fft2(gray)
    fft_shifted = np.fft.fftshift(fft)
    magnitude_spectrum = 20 * np.log(np.abs(fft_shifted))

    # Calculate the mean of the magnitude spectrum
    mean_spectrum = np.mean(magnitude_spectrum)

    # Determine if the image is blurry based on the threshold
    return mean_spectrum


# Write to Json file
with open(json_path, 'r') as file:
    data = json.load(file)

for img in sorted(os.listdir(path)):  # sorted : 防止亂序讀取
    if img != exclude_file:
        image_path = os.path.join(path, img)
        img_rbg = cv2.imread(image_path)
        is_blurry_fft = detect_blur_fft(img_rbg, threshold_value)  # Detect blur in the image using FFT

        for obj in data:
            if obj.get("PictureName") == img:
                obj["Blur"] = is_blurry_fft
                # print(img)

    # Write the updated data back to the JSON file
    with open(json_path, 'w') as file:
        json.dump(data, file, indent=4)  # Use indent for pretty formatting, if needed