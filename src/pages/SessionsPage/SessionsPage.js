import styled from "styled-components"
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import MovieBanner from "../../components/MovieBanner";

export default function SessionsPage() {
    const [sessions, setSessions] = useState(null);
    const { idMovie } = useParams();
    const url = `https://mock-api.driven.com.br/api/v8/cineflex/movies/${idMovie}/showtimes`;

    useEffect(() => {
        const promise = axios.get(url);

        promise.then(res => {
            setSessions(res.data);
        });
    }, []);

    if (sessions === null) {
        return <PageContainer>Carregando..</PageContainer>;
    }

    return (
        <PageContainer>
            Selecione o horário
            <div>
                {sessions.days.map((s) =>
                    <SessionContainer key={s.id}>
                        {s.weekday} - {s.date}
                        {s.showtimes.map((st) =>
                            <ButtonsContainer key={st.id}>
                                <Link to={`/assentos/${st.id}`}>
                                    <button>{st.name}</button>
                                </Link>
                            </ButtonsContainer>
                        )}
                    </SessionContainer>
                )}
            </div>

            <FooterContainer>
                <div>
                    <MovieBanner url={sessions.posterURL} alt={sessions.title} />
                </div>
                <div>
                    <p>{sessions.title}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
    div {
        margin-top: 20px;
    }
`
const SessionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: 'Roboto';
    font-size: 20px;
    color: #293845;
    padding: 0 20px;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    button {
        margin-right: 20px;
        cursor: pointer;
    }
    a {
        text-decoration: none;
    }
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