const addButton = document.querySelector('.js-comment-button');
const currentUserNameInput = document.querySelector('.js-input-name');
const textOfCommentInput = document.querySelector('.js-input-text');
const commentsList = document.querySelector('.js-comments-list');
const saveBtn = document.querySelector(".js-save-btn");
const link = document.querySelector(".js-link");



class CommentsActions {
    static createAddCommentEventListenerOnClick() {
        addButton.addEventListener('click', () => {
            this.generateNewElement();
        });
    }
    static createAddCommentEventListenerOnKeyDown() {
        textOfCommentInput.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                this.generateNewElement();
            }
        })
    }

    static generateNewElement() {
        const textOfComment = textOfCommentInput.value;
        let answeredUsersNames = currentUserNameInput.value + ':';
        if (localStorage.getItem('name')) {
            answeredUsersNames = currentUserNameInput.value + ':' + localStorage.getItem('name');

        }
        commentsList.insertAdjacentHTML("beforeend", this.createComment(answeredUsersNames, textOfComment, ));
        this.resetTemporaryStoreges();
    }

    static createComment(currentUserName, textOfComment) {
        return `<li class="list-group-item js-item"><span class="js-text"><span class="js-answered-users">${currentUserName}</span>${textOfComment}</span><button type="button" class="btn btn-outline-info js-answer-button">Answer</button></li>`
    }

    static getAnsweredUsers() {
        commentsList.addEventListener('click', (event) => {
            if (event.target.classList.contains('js-answer-button')) {
                const currentItem = event.target.closest('li').querySelector('.js-answered-users');
                const usersNames = currentItem.innerHTML;
                localStorage.setItem('name', usersNames)
            }
        });
    }

    static resetTemporaryStoreges() {
        textOfCommentInput.value = "";
        localStorage.clear();
    }
}

class TextDocumentActions {
    static initCreatingDocument() {
        saveBtn.addEventListener('click', () => {
            this.getItemsText()
        });
    }
    static getItemsText() {
        const items = document.querySelectorAll('.js-text');
        let itemsArray = [];
        for (let i = 0; i < items.length; i++) {
            itemsArray.push(items[i].innerText);
        };
        this.renderItems(itemsArray);
    }
    static renderItems(itemsArray) {
        const documentText = itemsArray;

        const items = [];
        for (let i = 0; i < documentText.length; i++) {
            let item = {};
            const itemArray = documentText[i].split(':');
            for (let k = 0; k < itemArray.length; k++) {
                const comArray = [];

                for (let j = 0; j < (itemArray.length - 2); j++) {
                    comArray.push(itemArray[k]);
                }
                item.id = i;
                item.comment = itemArray[itemArray.length - 1];
                item.autor = itemArray[itemArray.length - 2];
                item.commentator = itemArray[0];
                item.commentators = comArray.length;
            };
            items.push(item);
        };
        this.sortItemsbyAutor(items);
    };
    static sortItemsbyAutor(items) {
        const arr = items;
        for (let i = 0; i < arr.length; i++) {;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].autor === arr[j].autor) {
                    arr[j].id = arr[i].id;
                }
            }
        };
        this.sortItemsByCommentator(arr);
    }
    static sortItemsByCommentator(arr) {
        const itemsToSort = arr;
        itemsToSort.sort((a, b) => {
            if (a.commentators) {
                if (Number(a.id) < Number(b.id)) {
                    return -1;
                }
            };
        });
        this.edtiItemComment(itemsToSort);
    }
    static edtiItemComment(arr) {
        const sortedItems = arr;
        sortedItems.map(item => {
            if (item.commentators) {
                item.comment = "|-" + item.comment;
                for (let i = 0; i <= item.commentators; i++) {
                    item.comment = " " + item.comment;
                }
            }
        });
        this.stringifyItems(sortedItems);
    }
    static stringifyItems(sortedItems) {
        const itemsList = sortedItems;
        const newArray = [];
        for (let i = 0; i < itemsList.length; i++) {
            newArray.push(`${itemsList[i].commentator}:${itemsList[i].comment}\n`);
        }
        this.createTxtDocument(newArray);
    }
    static createTxtDocument(newArray) {
        const documentText = newArray;
        const blob = new Blob(documentText, { type: "text/plain;charset=utf-8", endings: "native" });
        link.href = URL.createObjectURL(blob);
    }
}
init();

function init() {
    CommentsActions.createAddCommentEventListenerOnClick();
    CommentsActions.createAddCommentEventListenerOnKeyDown();
    CommentsActions.getAnsweredUsers();
    TextDocumentActions.initCreatingDocument();
}