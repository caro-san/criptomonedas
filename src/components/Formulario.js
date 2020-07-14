import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda'
import axios from 'axios';

const Boton = styled.input`
    margin-top:20px;
    font-weight:bold;
    font-size:20px;
    padding:10px;
    background-color: #66A2FE;
    border: none;
    width:100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover{
        background-color: #326AC0;
        cursor:pointer;
    }
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) =>{

    const [listacripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo:'USD', nombre: 'Dolar Estadounidense'},
        { codigo:'EUR', nombre: 'Euro'},
        { codigo:'MXN', nombre: 'Peso Mexicano'},
        { codigo:'COP', nombre: 'Peso Colombiano'},
        { codigo:'ARS', nombre: 'Peso Argentino'},
        { codigo:'KRW', nombre: 'Won Surcoreano'},
        { codigo:'GBP', nombre: 'Libra Esterlina'},
    ]

    //Utilizar useMoneda
    const [moneda, SelectMonedas, actualizarState] = useMoneda('Elige tu moneda', '', MONEDAS);

    // Utilizar useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Cryptomoneda', '', listacripto);

    // Ejecutar llamado a la API
    useEffect(() => {
        const ConsultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);

        }
        ConsultarAPI();
    }, []);

    //Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda==='' || criptomoneda===''){
            guardarError(true);
            return;
        }
        //caso contrario, pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }


    return(
        <form
            onSubmit={cotizarMoneda}
        >
                {error ? <Error mensaje="Todos los campos son obligatorios"/> : null}

            <SelectMonedas />

            <SelectCripto />

            <Boton
                type="submit"
                value="Calcular"
            />

        </form>

    );
}

export default Formulario;