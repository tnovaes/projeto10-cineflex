import styled from "styled-components"
import MovieBanner from "../../components/MovieBanner";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function SeatsPage({ order, setOrder }) {
    const [seats, setSeats] = useState(null);
    const [seatSelected, setSeatSelected] = useState([]);
    const [seatReserved, setSeatReserved] = useState([]);
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");

    const { idSession } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSession}/seats`;
        const promise = axios.get(url);

        promise.then(res => {
            setSeats(res.data);
        });
    }, []);

    if (seats === null) {
        return <PageContainer>Carregando..</PageContainer>;
    }

    function changeStatus(isAvailable, id, name) {
        if (isAvailable === false) {
            alert("Esse assento não está disponível.")
            return;
        }
        if (!seatReserved.includes(id) && !seatSelected.includes(name)) {
            const newReserved = [...seatReserved, id];
            const newSelected = [...seatSelected, name];
            setSeatReserved(newReserved);
            setSeatSelected(newSelected);
        }
        else {
            const removeReserved = seatReserved.filter(s => s !== id);
            const removeSelected = seatSelected.filter(s => s !== name);
            setSeatReserved(removeReserved);
            setSeatSelected(removeSelected);
            return;
        }
    }

    function reserveSeats(e){
        e.preventDefault();
        const url = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many";
        const ids = seatReserved;
        const body = {ids, name, cpf}
        
        const promise = axios.post(url, body);

        promise.then(res => {
            setOrder({seats, seatSelected, name, cpf})
            navigate("/sucesso");
        });

        promise.catch(err => {
            console.log(err.response.data)
        });
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)
            <SeatsContainer>
                {seats.seats.map((s) =>
                    <SeatItem key={s.id} data-test="seat"
                        seatColor={s.isAvailable === false ? "unavailable" : seatSelected.includes(s.name) ? "selected" : "available"}
                        onClick={() => changeStatus(s.isAvailable, s.id, s.name)}
                    >
                        {s.name}
                    </SeatItem>
                )}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle seatColor="selected" />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle seatColor="available" />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle seatColor="unavailable" />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={reserveSeats}>
                <lable htmlFor="name">
                    Nome do Comprador:
                </lable>
                <input
                    data-test="client-name"
                    id="name"
                    placeholder="Digite seu nome..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required />

                <lable htmlFor="cpf">
                    CPF do Comprador:
                </lable>
                <input
                    data-test="client-cpf"
                    id="cpf"
                    placeholder="Digite seu CPF..."
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    required />

                <button data-test="book-seat-btn" type="submit">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <MovieBanner url={seats.movie.posterURL} title={seats.movie.title} />
                </div>
                <div>
                    <p>{seats.movie.title}</p>
                    <p>{seats.day.weekday} - {seats.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
        cursor: pointer;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${props => (props.seatColor === "selected" ? "#0E7D71" : props.seatColor === "unavailable" ? "#F7C52B" : "#808F9D")};         // Essa cor deve mudar
    background-color: ${props => (props.seatColor === "selected" ? "#1AAE9E" : props.seatColor === "unavailable" ? "#FBE192" : "#C3CFD9")};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${props => (props.seatColor === "selected" ? "#0E7D71" : props.seatColor === "unavailable" ? "#F7C52B" : "#808F9D")};         // Essa cor deve mudar
    background-color: ${props => (props.seatColor === "selected" ? "#1AAE9E" : props.seatColor === "unavailable" ? "#FBE192" : "#C3CFD9")};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
    cursor: pointer;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`