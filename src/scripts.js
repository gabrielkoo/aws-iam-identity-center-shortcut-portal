!((d, g, c, e) => {
  const FIELD_NAMES = ['identityCenterAlias', 'accountId', 'roleName', 'displayName', 'redirectUri'];
  const searchInput = d[g]('searchInput');
  const table = d[g]('roleTable');
  const theadRow = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  const modal = d[g]('createModal');
  const createRecordBtn = d[g]('createRecord');

  const loadDataFromLocalStorage = () => {
    const roleList = localStorage.getItem('roleList');
    if (roleList) {
      return JSON.parse(roleList);
    }
    return roleList;
  }

  const saveDataToLocalStorage = (roleList) => {
    localStorage.setItem('roleList', JSON.stringify(roleList));
  };

  let draggingEle, placeholderRow;
  let isDraggingStarted = false, x = 0, y = 0;

  const swap = (nodeA, nodeB) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  };

  const isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  const mouseDownHandler = (e) => {
    draggingEle = e.target.closest('tr');

    const rect = draggingEle.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

    d.addEventListener('mousemove', mouseMoveHandler);
    d.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = (e) => {
    const draggingRect = draggingEle.getBoundingClientRect();

    if (!isDraggingStarted) {
      isDraggingStarted = true;

      placeholderRow = d[c]('tr');
      draggingEle.parentNode.insertBefore(placeholderRow, draggingEle.nextSibling);
      placeholderRow.style.height = `${draggingRect.height}px`;
    }

    draggingEle.style.position = 'absolute';
    draggingEle.style.top = `${e.pageY - y}px`;
    draggingEle.style.left = `${e.pageX - x}px`;

    Array.from(draggingEle.children).forEach((child, i) => {
      child.style.width = `${theadRow.children[i].getBoundingClientRect().width - 24}px`;
    });

    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholderRow.nextElementSibling;

    if (prevEle && isAbove(draggingEle, prevEle)) {
      swap(placeholderRow, draggingEle);
      swap(placeholderRow, prevEle);
      return;
    }

    if (nextEle && isAbove(nextEle, draggingEle)) {
      swap(nextEle, placeholderRow);
      swap(nextEle, draggingEle);
    }
  };

  const mouseUpHandler = () => {
    if (placeholderRow && placeholderRow.parentNode) {
      placeholderRow.parentNode.removeChild(placeholderRow);
    }

    draggingEle.style.removeProperty('position');
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    Array.from(draggingEle.children).forEach((child, i) => {
      child.style.removeProperty('width');
    });

    x = null;
    y = null;
    draggingEle = null;
    isDraggingStarted = false;

    const roleList = loadDataFromLocalStorage();
    let newRoleList = [];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.forEach(row => {
      const record = roleList.find(r => r.id === row.dataset.id);
      if (record) {
        newRoleList.push(record);
      }
    });
    saveDataToLocalStorage(newRoleList);

    d.removeEventListener('mousemove', mouseMoveHandler);
    d.removeEventListener('mouseup', mouseUpHandler);
  };

  const setModalInEditMode = (id) => {
    modal.setAttribute('data-id', id);
    d[g]('createModalTitle').textContent = 'Edit Role Record';
    createRecordBtn.textContent = 'EDIT';
  }

  const setModalInCreateMode = () => {
    modal.setAttribute('data-id', '');
    d[g]('createModalTitle').textContent = 'Create Role Record';
    createRecordBtn.textContent = 'CREATE';
  }

  const openModal = (id) => {
    modal.style.display = 'block';

    if (id) {
      setModalInEditMode(id);
    } else {
      setModalInCreateMode();
    }
  }

  const closeModal = () => {
    modal.style.display = 'none';
    modal.setAttribute('data-id', '');
    resetForm();
  };

  const resetForm = () => {
    for (const fieldId of FIELD_NAMES) {
      d[g](fieldId).value = '';
    }
  };

  const buildSSOLink = ({
    identityCenterAlias,
    accountId,
    roleName,
    redirectUri,
  }) => {
    const queryParameters = new URLSearchParams({
      account_id: accountId,
      role_name: roleName,
      destination: redirectUri,
    });
    return `https://${identityCenterAlias}.awsapps.com/start/#/console?${queryParameters.toString()}`;
  };

  const renderTable = () => {
    const tableBody = d[g]('recordsTable');
    const roleList = loadDataFromLocalStorage();
    tableBody.innerHTML = '';

    roleList.forEach(({ id, identityCenterAlias, accountId, roleName, displayName, redirectUri }) => {
      const row = d[c]('tr');
      row.dataset.id = id;
      row.classList.add('draggable');

      const createCell = (key, content) => {
        const cell = d[c]('td');
        if (key) {
          cell.setAttribute('data-key', key);
        }

        if (content instanceof Node) {
          cell.appendChild(content);
        } else if (content !== '') {
          cell.textContent = content;
        }
        return cell;
      };

      const createLink = (href, text, target = '') => {
        const link = d[c]('a');
        link.href = href;
        link.textContent = text;
        if (target) link.target = target;
        return link;
      };

      Object.entries({ identityCenterAlias, accountId, roleName, displayName }).forEach(([fieldKey, fieldValue]) => {
        row.appendChild(createCell(fieldKey, fieldValue));
      });

      const redirectCell = createCell();
      if (redirectUri) {
        redirectCell.appendChild(createLink(redirectUri, 'Link'));
      }
      row.appendChild(redirectCell);

      const actionCell = d[c]('td');
      actionCell.className = 'action-buttons';
      actionCell.appendChild(createLink('#', '👤', '_blank'));
      actionCell.lastChild.onclick = (event) => {
        event.preventDefault();
        openSSOLink(id);
      };
      actionCell.appendChild(createLink('#', '📝'));
      actionCell.lastChild.onclick = (event) => {
        event.preventDefault();
        openModalInEditMode(id);
      };
      actionCell.appendChild(createLink('#', '🆕'));
      actionCell.lastChild.onclick = () => {
        event.preventDefault();
        cloneRecord(id);
      };
      actionCell.appendChild(createLink('#', '🗑️'));
      actionCell.lastChild.onclick = () => {
        event.preventDefault();
        deleteRecord(id);
      };
      row.appendChild(actionCell);

      tableBody.appendChild(row);

      row.addEventListener('mousedown', mouseDownHandler);
    });
  }

  const searchRecords = (searchTerm) => {
    const rows = d[g]('recordsTable').getElementsByTagName('tr');

    for (let row of rows) {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
  }

  searchInput.addEventListener('input', (event) => {
    searchRecords(event.target.value);
  });

  const getRecordById = (id) => {
    const roleList = loadDataFromLocalStorage();
    return roleList.find(r => r.id === id);
  }

  const openSSOLink = (id) => {
    const record = getRecordById(id);
    if (record) {
      const ssoLink = buildSSOLink(record);
      window.open(ssoLink, '_blank');
    } else {
      alert('Record not found.');
    }
  }

  const openModalInEditMode = (id) => {
    const record = getRecordById(id);
    if (record) {
      FIELD_NAMES.forEach(field => {
        d[g](field).value = record[field];
      });

      const createButton = d.querySelector('.create');
      createButton.textContent = 'EDIT';

      openModal(id);
    }
  }

  const createRecord = () => {
    const roleList = loadDataFromLocalStorage();
    const recordId = modal.getAttribute('data-id') || '';
    const id = recordId || Date.now().toString();
    let record = { id };

    for (const field of FIELD_NAMES) {
      record[field] = d[g](field).value;
    }

    if (!record.identityCenterAlias || !record.accountId || !record.roleName) {
      alert('Please fill in all required fields.');
      return;
    }

    let newRoleList = [...roleList];

    if (recordId) {
      const index = roleList.findIndex(r => r.id === recordId);
      if (index !== -1) {
        newRoleList = [...roleList];
        newRoleList[index] = record;
      } else {
        newRoleList.push(record);
      }
    } else {
      newRoleList.push(record);
    }
    saveDataToLocalStorage(newRoleList);
    renderTable();
    closeModal();
  };

  const cloneRecord = (id) => {
    const newRoleList = loadDataFromLocalStorage();
    const record = getRecordById(id);
    if (record) {
      const newId = Date.now().toString();
      const newRecord = { ...record, id: newId };
      newRoleList.push(newRecord);
      saveDataToLocalStorage(newRoleList);
      renderTable();
    }
  }

  const deleteRecord = (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      let newRoleList = loadDataFromLocalStorage();
      newRoleList = newRoleList.filter(r => r.id !== id);
      saveDataToLocalStorage(newRoleList);
      renderTable();
    }
  }

  d[g]('pastedShortcut').addEventListener('input', (event) => {
    const shortcutLink = event.target.value;
    if (!shortcutLink) return;
    try {
      const url = new URL(shortcutLink);
      const identityCenterAlias = url.hostname.endsWith('.awsapps.com') ? url.hostname.split('.')[0] : '';
      const queryParameters = new URLSearchParams(url.hash.split('?').slice(-1)[0]);
      const parameters = {
        identityCenterAlias,
        accountId: queryParameters.get('account_id'),
        roleName: queryParameters.get('role_name'),
        redirectUri: queryParameters.get('destination'),
      };

      for (const field of FIELD_NAMES) {
        const fieldValue = parameters[field];
        if (fieldValue) {
          d[g](field).value = fieldValue;
        }
      }
    } catch (error) {
      console.warn('Error parsing the pasted shortcut link:', error);
    }
  });

  e(d[g]('openModal'), () => openModal());
  e(d[g]('closeModal'), closeModal);
  e(d[g]('cancel'), closeModal);
  e(d[g]('createRecord'), createRecord);

  renderTable();
})(
  document,
  'getElementById',
  'createElement',
  (n, c) => n.addEventListener('click', c),
);
