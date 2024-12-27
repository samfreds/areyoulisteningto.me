function scrollToBottom() {
  const chatContainer = document.querySelector('.notecontainer');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
  scrollToBottom();
  
  const observer = new MutationObserver(function(mutations) {
      scrollToBottom();
  });

  const dataDisplay = document.getElementById('dataDisplay');
  observer.observe(dataDisplay, { 
      childList: true, 
      subtree: true 
  });

  window.addEventListener('resize', scrollToBottom);
});