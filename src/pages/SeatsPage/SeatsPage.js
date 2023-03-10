import styled from "styled-components"
import MovieBanner from "../../components/MovieBanner";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function SeatsPage() {
    const [seats, setSeats] = useState(null);
    const [seatSelected, setSeatSelected] = useState([]);
    const [seatReserved, setSeatReserved] = useState([]);

    const { idSession } = useParams();

    const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSession}/seats`;

    useEffect(() => {
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

    return (
        <PageContainer>
            Selecione o(s) assento(s)
            <SeatsContainer>
                {seats.seats.map((s) =>
                    <SeatItem key={s.id}
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

            <FormContainer>
                Nome do Comprador:
                <input
                    placeholder="Digite seu nome..."
                    required />

                CPF do Comprador:
                <input placeholder="Digite seu CPF..." required />

                <button type="submit">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer>
                <div>
                    <MovieBanner url={seats.movie.posterURL} title={seats.movie.title} />
                </div>
                <div>
                    <p>{seats.movie.title}</p>
                    <p>{seats.day.weekday} - {seats.day.date}</p>
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