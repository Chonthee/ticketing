import Link from 'next/link'
// Component
const LandingPage = ({currentUser, tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link legacyBehavior href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )
    });
    return(
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
};

// Fetch data in here
LandingPage.getInitialProps = async (context, client, currentUser) => {
    // console.log('Landing page');
    // const client = await buildClient(context);
    // const {data} = await client.get('/api/users/currentuser');
    
    // return data;

    const {data} =await client.get('/api/tickets');
    return {tickets: data};
};

export default LandingPage;