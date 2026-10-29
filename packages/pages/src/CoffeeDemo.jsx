import { useState } from 'react';
import { ChatMessage, CoffeeMenu, OrderCard } from '@coffee-bot/shared';
import { Button } from '@coffee-bot/button';
import './coffeepage.css';
import './coffeedemo.css';

const menu = [
  { id: 'demo-cappuccino', title: 'Cappuccino', price: 49, desc: 'Exempelprodukt: kaffe med mjölk och skum.' },
  { id: 'demo-cortado', title: 'Cortado', price: 39, desc: 'Exempelprodukt: en mindre kaffedryck med mjölk.' },
  { id: 'demo-bryggkaffe', title: 'Bryggkaffe', price: 37, desc: 'Exempelprodukt: en kopp bryggkaffe.' },
];
const welcome = () => [{ role: 'assistant', content: 'Välkommen! Prova ett av exemplen nedan för att se meny och beställningsflöde.' }];

export const CoffeeDemo = () => {
  const [messages, setMessages] = useState(welcome);
  const [announcement, setAnnouncement] = useState('');

  const showMenu = () => {
    setMessages((previous) => [...previous,
      { role: 'user', content: 'Visa menyn.' },
      { role: 'assistant', content: 'Här är den lokala exempelmenyn. Produkter och priser är fasta i visningsdemon.', type: 'menu', items: menu },
    ]);
    setAnnouncement('Exempelmenyn visas i konversationen.');
  };

  const order = (quantity) => {
    const items = [
      { name: menu[0].title, quantity, price: menu[0].price },
      { name: menu[1].title, quantity: 1, price: menu[1].price },
    ];
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setMessages((previous) => [...previous.map((message) => message.orderStatus === 'pending' ? { ...message, orderStatus: 'editing' } : message),
      { role: 'user', content: `Jag vill beställa ${quantity} cappuccino och en cortado.` },
      { role: 'assistant', content: 'Det här är ett förskrivet exempel. Summan i kortet beräknas av JavaScript från exempelmenyn.', order: { items, total }, orderStatus: 'pending' },
    ]);
    setAnnouncement('Ett nytt beställningsförslag visas.');
  };

  const confirm = (index) => {
    setMessages((previous) => previous.map((message, i) => i === index && message.orderStatus === 'pending' ? { ...message, orderStatus: 'confirmed' } : message));
    setAnnouncement('Exempelbeställningen är bekräftad lokalt. Ingenting har skickats eller betalats.');
  };

  const edit = (index) => {
    setMessages((previous) => [...previous.map((message, i) => i === index ? { ...message, orderStatus: 'editing' } : message),
      { role: 'assistant', content: 'Välj ”Ändra till en cappuccino och en cortado” nedan för att visa ett nytt komplett beställningsförslag.' },
    ]);
    setAnnouncement('Välj ändringsexemplet för ett nytt förslag.');
  };

  const unknownProduct = () => {
    setMessages((previous) => [...previous,
      { role: 'user', content: 'Jag vill beställa en pizza.' },
      { role: 'assistant', content: 'Exempel på avvisad produkt: pizza finns inte i exempelmenyn. Inget beställningskort skapas. I AI-versionen kontrollerar JavaScript de tolkade produkterna mot den hämtade menyn.' },
    ]);
    setAnnouncement('Exemplet på en okänd produkt visas.');
  };

  return (
    <main className='coffee-page'>
      <p className='coffee-demo__eyebrow'>Utbildningsprojekt · Interaktiv visningsdemo</p>
      <h1 className='coffee-page__title'>Coffee Bot</h1>
      <aside className='coffee-demo__notice' aria-label='Om visningsdemon'>
        <p><strong>Förskrivna exempel – ingen aktiv AI.</strong> Prova hur chatten, menyn och beställningskorten fungerar. Exempelmenyn är lokal och ingen riktig beställning görs.</p>
        <p>Den riktiga versionen använder LangChain och en lokal Ollama-modell. Den beskrivs i <a href='https://github.com/AngelaRaven84/coffee-bot'>projektets README på GitHub</a>.</p>
      </aside>
      <div className='coffee-page__actions'>
        <Button onClick={() => { setMessages(welcome()); setAnnouncement('Visningsdemon är återställd.'); }}>Börja om</Button>
      </div>
      <section aria-label='Exempelkonversation'>
        {messages.map((message, index) => (
          <div key={index} className='coffee-demo__turn'>
            <ChatMessage role={message.role}>{message.content}</ChatMessage>
            {message.type === 'menu' && <CoffeeMenu items={message.items} initiallyOpen />}
            {message.order && <OrderCard order={message.order} orderStatus={message.orderStatus} onConfirm={() => confirm(index)} onEdit={() => edit(index)} isLoading={false} />}
          </div>
        ))}
      </section>
      <section className='coffee-demo__examples' aria-labelledby='demo-examples'>
        <h2 id='demo-examples'>Välj ett exempel</h2>
        <p>De här knapparna visar fasta scenarier, inte fria frågor till en AI.</p>
        <div className='coffee-demo__buttons'>
          <Button onClick={showMenu}>Visa exempelmenyn</Button>
          <Button onClick={() => order(2)}>Beställ två cappuccino och en cortado</Button>
          <Button onClick={() => order(1)}>Ändra till en cappuccino och en cortado</Button>
          <Button onClick={unknownProduct}>Visa okänd produkt</Button>
        </div>
      </section>
      <p className='coffee-demo__announcement' role='status'>{announcement}</p>
      <p className='coffee-demo__footer'>Allt finns bara under besöket. Börja om eller ladda om sidan för att återställa demon.</p>
    </main>
  );
};
