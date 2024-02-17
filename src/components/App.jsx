import { Component } from 'react';
import { AddContactForm } from './AddContactForm/AddContactForm';
import { nanoid } from 'nanoid';
import { AppStyled } from './App.styled';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

const initialContacts = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];
const CONTACTS_LOCAL_STORAGE_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    let contacts = localStorage.getItem(CONTACTS_LOCAL_STORAGE_KEY);

    if (!contacts || contacts.length === 0) {
      contacts = [...initialContacts];
    } else {
      contacts = JSON.parse(contacts);
    }
    this.setState({ contacts });
  }

  addNewContact = ({ name, number, onSuccess }) => {
    const nameLower = name.toLowerCase();
    const idx = this.state.contacts.findIndex(
      c => c.name.toLowerCase() === nameLower
    );
    if (idx > -1) {
      alert(`${name} is already in contacts`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(prevState => {
      const newContacts = [...prevState.contacts, newContact];

      localStorage.setItem(
        CONTACTS_LOCAL_STORAGE_KEY,
        JSON.stringify(newContacts)
      );

      return { contacts: newContacts };
    });

    onSuccess();
  };

  deleteContact = id => {
    this.setState(prevState => {
      const newContacts = prevState.contacts.filter(c => c.id !== id);

      localStorage.setItem(
        CONTACTS_LOCAL_STORAGE_KEY,
        JSON.stringify(newContacts)
      );

      return {
        contacts: newContacts,
      };
    });
  };

  handleFilterChange = value => {
    this.setState({ filter: value });
  };

  render() {
    const filterLower = this.state.filter.toLocaleLowerCase();
    const filteredContacts = this.state.contacts.filter(c =>
      c.name.toLowerCase().includes(filterLower)
    );

    return (
      <AppStyled>
        <div className="container">
          <h2 className="chapter-name">Phonebook</h2>
          <AddContactForm onSubmit={this.addNewContact} />
          <h2 className="chapter-name">Contacts</h2>
          <Filter
            value={this.state.filter}
            handleChange={this.handleFilterChange}
          />
          {filteredContacts.length > 0 && (
            <ContactList
              contacts={filteredContacts}
              deleteContact={this.deleteContact}
            />
          )}
        </div>
      </AppStyled>
    );
  }
}
