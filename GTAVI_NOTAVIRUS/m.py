import tkinter as tk
import random
import webbrowser

class TransparentSnakeGame:
    def __init__(self, root):
        self.root = root
        self.root.configure(bg='beige')
        self.root.wm_attributes("-transparentcolor", "beige")
        self.root.wm_attributes("-topmost", True)
        self.root.overrideredirect(1)
        
        # Set game area to top of screen
        screen_width = self.root.winfo_screenwidth()
        self.game_width = screen_width
        self.game_height = 400
        
        self.root.geometry(f"{self.game_width}x{self.game_height}+0+0")
        
        # Game canvas
        self.canvas = tk.Canvas(root, bg='beige', highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        # Game variables
        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.direction = "Right"
        self.apple = None
        self.score = 0
        self.game_active = True
        
        # ADHD video URLs (YouTube)
        self.adhd_videos = [
            "https://youtu.be/dQw4w9WgXcQ",
            "https://youtu.be/3JZ_D3ELwOQ",
            "https://youtu.be/0so5er4X3dc"
        ]
        
        self.create_apple()
        self.setup_controls()
        self.update_game()
    
    def setup_controls(self):
        self.root.bind("<Left>", lambda e: self.change_direction("Left"))
        self.root.bind("<Right>", lambda e: self.change_direction("Right"))
        self.root.bind("<Up>", lambda e: self.change_direction("Up"))
        self.root.bind("<Down>", lambda e: self.change_direction("Down"))
    
    def change_direction(self, new_dir):
        opposites = [("Left", "Right"), ("Right", "Left"), 
                    ("Up", "Down"), ("Down", "Up")]
        if (self.direction, new_dir) not in opposites:
            self.direction = new_dir
    
    def create_apple(self):
        while True:
            x = random.randint(1, (self.game_width-20)//20)*20
            y = random.randint(1, (self.game_height-20)//20)*20
            if (x, y) not in self.snake:
                self.apple = (x, y)
                break
        
        self.canvas.create_oval(x, y, x+20, y+20, fill="red", tag="apple")
    
    def update_game(self):
        if not self.game_active:
            return
            
        # Move snake
        head_x, head_y = self.snake[0]
        if self.direction == "Left": head_x -= 20
        elif self.direction == "Right": head_x += 20
        elif self.direction == "Up": head_y -= 20
        elif self.direction == "Down": head_y += 20
        
        new_head = (head_x, head_y)
        
        # Check collisions
        if (head_x < 0 or head_x >= self.game_width or
            head_y < 0 or head_y >= self.game_height or
            new_head in self.snake):
            self.game_over()
            return
            
        self.snake.insert(0, new_head)
        
        # Check apple collision
        if new_head == self.apple:
            self.score += 1
            self.canvas.delete("apple")
            self.create_apple()
        else:
            self.snake.pop()
        
        # Redraw snake
        self.canvas.delete("snake")
        for segment in self.snake:
            x, y = segment
            self.canvas.create_rectangle(
                x, y, x+20, y+20, fill="white", outline="beige", tag="snake"
            )
        
        self.root.after(200, self.update_game)
    
    def game_over(self):
        self.game_active = False
        self.canvas.delete("all")
        self.canvas.create_text(
            self.game_width/2, self.game_height/2,
            text=f"Game Over! Score: {self.score}\nRedirecting to ADHD video...",
            fill="white", font=("Segoe UI", 24)
        )
        
        # Play random ADHD video
        video_url = random.choice(self.adhd_videos)
        webbrowser.open(video_url)
        
        # Close window after 5 seconds
        self.root.after(5000, self.root.destroy)

if __name__ == "__main__":
    root = tk.Tk()
    game = TransparentSnakeGame(root)
    root.mainloop()