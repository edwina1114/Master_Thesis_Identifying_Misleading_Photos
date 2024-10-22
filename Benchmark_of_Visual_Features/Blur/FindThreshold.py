import os
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Path to the folder containing images
path = "/Users/edwina/Desktop/Blur/FormalPics"  # mac
photoset = "/Users/edwina/Desktop/ResearchOfEdwina/Codes/Benchmark_of_Visual_Features/PhotoSets"
exclude_file = ".DS_Store"

# Lists to hold the blur metrics for plotting
mean_spectrums = []
blur_labels = []

# Function to detect blur using FFT
def detect_blur_fft(image):
    try:
        # Convert the image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Calculate the 2D Discrete Fourier Transform
        fft = np.fft.fft2(gray)
        fft_shifted = np.fft.fftshift(fft)
        magnitude_spectrum = 20 * np.log(np.abs(fft_shifted))

        # Calculate the mean of the magnitude spectrum
        mean_spectrum = np.mean(magnitude_spectrum)
        
        return mean_spectrum
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

# Check if the path exists
if not os.path.exists(photoset):
    print(f"The path {photoset} does not exist.")
else:
    # Read the images from the specified path
    for img in sorted(os.listdir(photoset)):  # sorted: Prevent out-of-order reading
        if img != exclude_file:
            image_path = os.path.join(photoset, img)
            img_rbg = cv2.imread(image_path)

            if img_rbg is not None:
                # Calculate the mean spectrum for the image
                mean_spectrum = detect_blur_fft(img_rbg)

                if mean_spectrum is not None:
                    mean_spectrums.append(mean_spectrum)
                    # Manually label the image as blurry (1) or not blurry (0) for initial analysis
                    # This labeling is for plotting and threshold determination purposes
                    # Replace with your manual labels or logic
                    blur_labels.append(1 if 'blurry' in img.lower() else 0)
            else:
                print(f"Could not read image: {img}")

    # Print mean spectrum values and labels for debugging
    # print("Mean Spectrum Values:", mean_spectrums)
    # print("Blur Labels:", blur_labels)
    # Calculate and print the average of the mean spectrum values
    average_mean_spectrum = sum(mean_spectrums) / len(mean_spectrums) if mean_spectrums else 0
    print("Average Mean Spectrum Value:", average_mean_spectrum)

    