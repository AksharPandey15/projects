// Get DOM elements
const plainText = document.getElementById("plainText");
const markdownOutput = document.getElementById("markdownOutput");

// Function to update Markdown output automatically as plain text is typed
plainText.addEventListener("input", () => {
  markdownOutput.value = plainText.value;
});

// Function to apply Markdown formatting
function applyMarkdown(type) {
  const text = plainText.value.trim();

  if (!text) {
    alert("Please type something in the text area!");
    return;
  }

  let formattedText = "";

  switch (type) {
    case 'h1':
      formattedText = `# ${text}`;
      break;
    case 'h2':
      formattedText = `## ${text}`;
      break;
    case 'bold':
      formattedText = `**${text}**`;
      break;
    case 'italic':
      formattedText = `*${text}*`;
      break;
    case 'link':
      formattedText = `[${text}](http://example.com)`;
      break;
    default:
      formattedText = text;
  }

  // Update both text areas with the new formatted text
  plainText.value = text; // Keep the plain text as it was
  markdownOutput.value = formattedText; // Show the Markdown equivalent
}
