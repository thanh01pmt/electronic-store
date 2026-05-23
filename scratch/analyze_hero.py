import numpy as np
from PIL import Image

def analyze_layout(img_path):
    img = Image.open(img_path).convert('RGB')
    width, height = img.size
    data = np.array(img)
    
    # 1. Row brightness and color profile
    row_means = np.mean(data, axis=1) # (height, 3)
    
    print(f"Image dimensions: {width}x{height}")
    
    # Let's detect background changes
    # For example, dark vs light bands
    gray_rows = np.mean(row_means, axis=1)
    
    print("\nVertical segments based on average row intensity (gray value 0-255):")
    segment_starts = []
    current_state = 'dark' if gray_rows[0] < 80 else 'light'
    segment_starts.append((0, current_state))
    
    for y in range(1, height):
        state = 'dark' if gray_rows[y] < 80 else 'light'
        if state != current_state:
            segment_starts.append((y, state))
            current_state = state
            
    for idx, (y, state) in enumerate(segment_starts):
        end_y = segment_starts[idx+1][0] if idx+1 < len(segment_starts) else height
        height_seg = end_y - y
        sub_mean_color = np.mean(row_means[y:end_y], axis=0).astype(int)
        print(f"  Range {y:4d} to {end_y:4d} (height: {height_seg:4d}): {state.upper()} background, mean RGB: {list(sub_mean_color)}")

    # Let's search for green color regions (which might contain the logo, CTAs, or green highlights)
    # Green condition: G > 1.2 * R and G > 1.2 * B and G > 50
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    green_mask = (g > 1.2 * r) & (g > 1.2 * b) & (g > 50)
    green_y, green_x = np.where(green_mask)
    if len(green_y) > 0:
        print(f"\nDetected {len(green_y)} pixels with VICHIP Green accent color.")
        # Group them vertically
        hist, bin_edges = np.histogram(green_y, bins=10)
        print("Vertical distribution of green pixels:")
        for i in range(10):
            print(f"  Range {int(bin_edges[i]):4d} to {int(bin_edges[i+1]):4d}: {hist[i]} green pixels")
            
    # Let's scan for horizontal white/bright text lines
    # Sum across rows for high intensity (R, G, B > 200)
    bright_mask = (r > 200) & (g > 200) & (b > 200)
    bright_y_profile = np.sum(bright_mask, axis=1)
    
    print("\nDetected potential text lines (high density of bright pixels):")
    # Simple peak detection
    in_peak = False
    peak_start = 0
    for y in range(height):
        # if more than 2% of the width is bright, count as text/element line
        is_bright_line = bright_y_profile[y] > (0.015 * width)
        if is_bright_line and not in_peak:
            in_peak = True
            peak_start = y
        elif not is_bright_line and in_peak:
            in_peak = False
            # check height of peak
            if y - peak_start > 2:
                print(f"  Text/Bright line at Y-range {peak_start:4d} - {y:4d} (height: {y - peak_start:3d}px, density: {np.mean(bright_y_profile[peak_start:y]):.1f}px)")

if __name__ == '__main__':
    analyze_layout('public/hero-section.png')
