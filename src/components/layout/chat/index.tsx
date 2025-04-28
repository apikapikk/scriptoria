import styles from './ContactList.module.css';
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

interface Employee {
  id_employee: string;
  name_employee: string;
}

const ContactList = () => {
  const [contacts, setContacts] = useState<Employee[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (cookie) {
      const user = JSON.parse(cookie);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("id_employee, name_employee")
        .neq("id_employee", userId);

      if (error) {
        console.error("Error fetching contacts:", error);
      } else {
        setContacts(data || []);
      }
    };

    if (userId) {
      fetchContacts();
    }
  }, [userId]);

  const handleSelectContact = (contactId: string) => {
    router.push(`/chat/${contactId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Contact List</div>
      <ul className={styles.list}>
        {contacts.map((contact) => (
          <li
            key={contact.id_employee}
            className={styles.listItem}
            onClick={() => handleSelectContact(contact.id_employee)}
          >
            {contact.name_employee}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
