import tkinter as tk
import datetime as timeaurdin

root = tk.Tk()

# Get the screen width and height
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

# Set the window size (for example, 450x100)
window_width = 450
window_height = 100

# Calculate the position for the top-right corner
x_position = screen_width - window_width
y_position = 0

# Set the window geometry (position + size)
root.geometry(f"{window_width}x{window_height}+{x_position}+{y_position}")
root.title("")
root.configure(bg="beige")  # Match transparent color
root.wm_overrideredirect(1)
root.wm_attributes("-topmost", True)
root.wm_attributes("-transparentcolor", "beige")

# Create the labels for time and date with a transparent background
lbl = tk.Label(root, fg="white", bg="beige", font=("Segoe UI", 32, "bold"))
lbl.place(relx=0, rely=0, relheight=0.5, relwidth=1.3)

nbl = tk.Label(root, fg="white", bg="beige", font=("Segoe UI", 20))
nbl.place(relx=0, rely=0.5, relheight=0.5, relwidth=1.3)

def UpdateTimeaurDin():
    datenow = timeaurdin.datetime.now()
    time_str = datenow.strftime("%I:%M:%S %p")  # 12-hour format for time
    date_str = datenow.strftime("%A, %B %d, %Y")  # Full date format

    lbl.configure(text=time_str)
    nbl.configure(text=date_str)

    root.after(1000, UpdateTimeaurDin)  # Update every 1 second

UpdateTimeaurDin()

root.mainloop()
