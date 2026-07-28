document.getElementById('resumeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value;
    const experience = document.getElementById('experience').value;

    // Create the resume content for display on the page
    const resumeContent = `
        <div class="section">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
        </div>
        
        <div class="section">
            <h3>Education</h3>
            <p>${education}</p>
        </div>

        <div class="section">
            <h3>Skills</h3>
            <p>${skills}</p>
        </div>

        <div class="section">
            <h3>Work Experience</h3>
            <p>${experience}</p>
        </div>
    `;

    // Display the resume in the "resume" section on the page
    document.getElementById('resume').innerHTML = resumeContent;
    document.querySelector('.resume-section').style.display = 'block';

    // Show the download PDF button
    document.getElementById('downloadBtn').style.display = 'inline-block';

    // Handle PDF generation on button click
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set fonts and styles for PDF
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black color for text

        // Set the design of the PDF (colors, margins, etc.)
        const margin = 20;
        let y = margin;

        // Title
        doc.setFontSize(22);
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text('Resume', margin, y);
        y += 10;

        // Personal Information
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text('Personal Information', margin, y);
        y += 10;

        doc.setFontSize(16);
        doc.text(`Name: ${name}`, margin, y);
        y += 8;
        doc.text(`Email: ${email}`, margin, y);
        y += 8;
        doc.text(`Phone: ${phone}`, margin, y);
        y += 15;

        // Education
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text('Education', margin, y);
        y += 10;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(education, margin, y);
        y += 15;

        // Skills
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text('Skills', margin, y);
        y += 10;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(skills, margin, y);
        y += 15;

        // Work Experience
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text('Work Experience', margin, y);
        y += 10;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(experience, margin, y);
        y += 15;

        // Save the PDF
        doc.save(`${name}_Resume.pdf`);
    });
});
