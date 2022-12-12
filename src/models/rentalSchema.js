import joi from 'joi';

export const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    rentDate: joi.string().min(10).max(10).required(),    // data em que o aluguel foi feito
    daysRented: joi.number().min(1).positive().required(),             // por quantos dias o cliente agendou o aluguel
    returnDate: joi.required(),          // data que o cliente devolveu o jogo (null enquanto não devolvido)
    originalPrice: joi.number().required(),       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
    delayFee: joi.required()             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
});