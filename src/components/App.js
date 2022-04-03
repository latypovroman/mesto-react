import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from './contexts/CurrentUserContext.js';
import DeletePopup from './DeletePopup.js';


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardFOrDelete, setCardFOrDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  function fetchInitialCards() {
    return api.getInitialCards()
           .then((data) => {
             setCards(data);
           })
  }

  function fetchUserInfo() {
    return api.getUserInfo()
           .then((data) => {
              setCurrentUser(data);
           })
  }

  React.useEffect(() => {
    fetchInitialCards();
    fetchUserInfo();
  }, [])

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const handleDeleteButtonClick = (card) => {
    setIsDeletePopupOpen(true);
    setCardFOrDelete(card);
  }

  const handleUpdateUser = (data) => {
    api.patchUserInfo(data)
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
  }

  const handleUpdateAvatar = (data) => {
    api.patchUserAvatar(data)
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
  }

  const handleAddPlaceSubmit = (data) => {
    api.postNewCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
  }

  const handleCardLike = (card) => {

    const isLiked = card.likes.some(user => user._id === currentUser._id);

    function setLikeState(newCard) {

      setCards((state) =>
        state.map((stateCard) => stateCard._id === card._id ? newCard : stateCard))

    }

    if (isLiked) {

      api.deleteLike(card)
      .then((newCard) => {
        setLikeState(newCard)
      })

    } else {

      api.putLike(card)
      .then((newCard) => {
        setLikeState(newCard)
      })
    }
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card)
    .then(() => {
      setCards((state) => state.filter((stateCard) => stateCard !== card))});
      closeAllPopups();
  }

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpen(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteButtonClick}
        />
        <Footer />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <DeletePopup card={cardFOrDelete} isOpen={isDeletePopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete}/>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
