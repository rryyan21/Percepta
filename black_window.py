import tkinter as tk

# Create the main window
root = tk.Tk()
root.title("Black Window")
root.configure(bg='black')

# Set window size (optional - you can adjust this)
root.geometry("800x600")

# Create a label with white text
text_label = tk.Label(
    root,
    text="White Text",
    fg='white',
    bg='black',
    font=('Arial', 16)
)

# Position the label in the top right corner
text_label.place(relx=1.0, rely=0.0, anchor='ne', x=-10, y=10)

# Run the main loop
root.mainloop()

