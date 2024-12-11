document.addEventListener('DOMContentLoaded', () => {
    const spans = document.querySelectorAll('.off-text span');
    
    spans.forEach(span => {
        span.addEventListener('mouseover', () => {
            span.classList.add('revealed');
        });
    });
});