export const clearSection = (...section) => {
  section.forEach((element) => {
    element.innerHTML = '';
  });
};

/**Highlight card when date is due */
export const highlightCard = (notStartedSection, inProgressSection) => {
  Array.from(notStartedSection.children).forEach((card) => {
    const currentDate = new Date();
    const dueDate = new Date(card.children[1].value);
    if (currentDate > dueDate) card.style.borderLeft = '8px solid #2196F3';
    else card.style.borderLeft = 'none';
  });
  Array.from(inProgressSection.children).forEach((card) => {
    const currentDate = new Date();
    const dueDate = new Date(card.children[2].value);
    if (currentDate > dueDate) card.style.borderLeft = '8px solid #2196F3';
    else card.style.borderLeft = 'none';
  });
};
