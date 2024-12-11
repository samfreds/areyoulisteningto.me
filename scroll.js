function scrollToBottom() {
  const chatContainer = document.querySelector('.notecontainer');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add this to your existing DOMContentLoaded event or create a new one
document.addEventListener('DOMContentLoaded', function() {
  // Initial scroll to bottom
  scrollToBottom();
  
  // Create a MutationObserver to watch for new messages
  const observer = new MutationObserver(function(mutations) {
      scrollToBottom();
  });

  // Start observing the dataDisplay element for changes
  const dataDisplay = document.getElementById('dataDisplay');
  observer.observe(dataDisplay, { 
      childList: true, 
      subtree: true 
  });

  // Add scroll to bottom when window is resized
  window.addEventListener('resize', scrollToBottom);
});