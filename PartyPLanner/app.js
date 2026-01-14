class PartyPlanner {
    constructor() {
        this.partyTypes = {
            birthday: {
                games: {
                    kids: [
                        "Musical Chairs",
                        "Treasure Hunt",
                        "Pin the Tail",
                        "Balloon Pop Game",
                        "Face Painting",
                        "Piñata Time",
                        "Duck Duck Goose",
                        "Simon Says"
                    ],
                    teens: [
                        "Video Game Tournament",
                        "Karaoke Contest",
                        "Dance Competition",
                        "Truth or Dare",
                        "TikTok Challenge",
                        "Scavenger Hunt",
                        "Just Dance Party",
                        "Board Game Marathon"
                    ],
                    adults: [
                        "Trivia Night",
                        "Casino Games",
                        "Murder Mystery",
                        "Charades",
                        "Pictionary",
                        "Card Games Tournament",
                        "Escape Room Challenge",
                        "Karaoke Night"
                    ]
                }
            },
            wedding: [
                "Garden Wedding",
                "Beach Ceremony",
                "Intimate Ceremony",
                "Park Wedding",
                "Vineyard Celebration"
            ],
            graduation: [
                "Family Dinner",
                "BBQ Party",
                "Restaurant Party",
                "Beach Bonfire",
                "Park Picnic"
            ]
        };

        this.menuItems = {
            appetizers: [
                "Bruschetta",
                "Mini Quiches",
                "Cheese Platter",
                "Spring Rolls",
                "Deviled Eggs",
                "Spinach Dip",
                "Chicken Wings",
                "Stuffed Mushrooms"
            ],
            mainCourse: [
                "Grilled Chicken",
                "Pasta Bar",
                "Taco Station",
                "Pizza Variety",
                "BBQ Ribs",
                "Burger Sliders",
                "Vegetarian Lasagna",
                "Seafood Paella"
            ],
            desserts: [
                "Chocolate Cake",
                "Cupcake Assortment",
                "Fruit Tarts",
                "Ice Cream Bar",
                "Cheesecake Bites",
                "Cookie Platter",
                "Brownies",
                "Tiramisu"
            ],
            drinks: [
                "Fruit Punch",
                "Lemonade",
                "Iced Tea",
                "Soda Selection",
                "Mocktails",
                "Coffee/Tea Station",
                "Smoothies",
                "Water Infusions"
            ]
        };

        this.checklist = {
            weekBefore: [
                "Send final guest count confirmation",
                "Order/buy decorations",
                "Plan music playlist",
                "Confirm food menu",
                "Buy non-perishable items",
                "Check party supplies",
                "Make a cool Screen Saver for music (party music playlist app)"
            ],
            dayBefore: [
                "Buy fresh ingredients",
                "Clean party space",
                "Prepare make-ahead dishes",
                "Charge cameras/devices",
                "Set up decorations",
                "Chill drinks"
            ],
            partyDay: [
                "Set up food stations",
                "Prepare fresh dishes",
                "Set up music system",
                "Welcome guests",
                "Take photos",
                "Enjoy the party!"
            ]
        };

        this.init();
    }

    init() {
        // Create party type selector
        const partyTypeSelect = document.createElement('select');
        partyTypeSelect.id = 'partyType';
        partyTypeSelect.innerHTML = `
            <option value="">Select Party Type</option>
            <option value="birthday">Birthday Party</option>
            <option value="wedding">Wedding</option>
            <option value="graduation">Graduation</option>
        `;

        // Create age group selector for birthday games
        const ageGroupSelect = document.createElement('select');
        ageGroupSelect.id = 'ageGroup';
        ageGroupSelect.innerHTML = `
            <option value="">Select Age Group</option>
            <option value="kids">Kids (5-12)</option>
            <option value="teens">Teens (13-19)</option>
            <option value="adults">Adults (20+)</option>
        `;
        ageGroupSelect.style.display = 'none';

        // Add to DOM
        const eventDetails = document.querySelector('.event-details');
        eventDetails.appendChild(partyTypeSelect);
        eventDetails.appendChild(ageGroupSelect);

        // Add suggestions section
        const suggestionsSection = document.createElement('section');
        suggestionsSection.className = 'suggestions-section';
        suggestionsSection.innerHTML = `
            <h2>Party Suggestions</h2>
            <div id="suggestionsResult"></div>
        `;
        document.querySelector('main').appendChild(suggestionsSection);

        // Initialize menu buttons
        document.querySelectorAll('.menu-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showMenuCategory(e.target.dataset.category);
                this.setActiveButton(e.target);
            });
        });

        // Show initial menu category
        this.showMenuCategory('appetizers');
        
        // Initialize checklist
        this.initializeChecklist();

        // Event listeners
        this.partyType = partyTypeSelect;
        this.ageGroup = ageGroupSelect;
        
        this.partyType.addEventListener('change', () => this.handlePartyTypeChange());
        this.ageGroup.addEventListener('change', () => this.updateSuggestions());
    }

    handlePartyTypeChange() {
        const selectedType = this.partyType.value;
        
        // Show/hide age group selector for birthday parties
        this.ageGroup.style.display = selectedType === 'birthday' ? 'block' : 'none';
        
        this.updateSuggestions();
    }

    updateSuggestions() {
        const suggestionsResult = document.getElementById('suggestionsResult');
        const selectedType = this.partyType.value;
        
        if (!selectedType) return;

        let suggestions;
        if (selectedType === 'birthday') {
            const ageGroup = this.ageGroup.value;
            if (!ageGroup) return;
            suggestions = this.partyTypes.birthday.games[ageGroup];
        } else {
            suggestions = this.partyTypes[selectedType];
        }

        const randomSuggestions = this.getRandomItems(suggestions, 4);
        
        suggestionsResult.innerHTML = `
            <div class="suggestions-grid">
                ${randomSuggestions.map(suggestion => `
                    <div class="suggestion-card">
                        <h3>${suggestion}</h3>
                        <p>${this.capitalizeFirstLetter(selectedType)} Activity</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    showMenuCategory(category) {
        const menuSuggestions = document.getElementById('menuSuggestions');
        const items = this.menuItems[category];
        
        menuSuggestions.innerHTML = `
            <div class="menu-grid">
                ${items.map(item => `
                    <div class="menu-item">
                        <h4>${item}</h4>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setActiveButton(activeButton) {
        document.querySelectorAll('.menu-btn').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    initializeChecklist() {
        Object.entries(this.checklist).forEach(([timing, items]) => {
            const ul = document.getElementById(timing);
            ul.innerHTML = items.map(item => `
                <li>
                    <label>
                        <input type="checkbox">
                        <span>${item}</span>
                    </label>
                </li>
            `).join('');
        });
    }
}

// Initialize the app
new PartyPlanner();
