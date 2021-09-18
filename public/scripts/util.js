const usernameBox = document.getElementById('username');
const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};

export const callAPI = async (url, requestOptions) => {
  return fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

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
    else card.style.borderLeft = '8px solid transparent';
  });
  Array.from(inProgressSection.children).forEach((card) => {
    const currentDate = new Date();
    const dueDate = new Date(card.children[2].value);
    if (currentDate > dueDate) card.style.borderLeft = '8px solid #2196F3';
    else card.style.borderLeft = '8px solid transparent';
  });
};

export const sortTask = (data, index, section) => {
  return data.sort((a, b) => {
    return section === a[3] && a[3] === b[3] ? new Date(a[index]) - new Date(b[index]) : 0;
  });
};

callAPI('/username', requestOptionsGet).then((res) => (usernameBox.innerHTML = res.username));
