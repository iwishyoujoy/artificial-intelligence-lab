% players

player(me).
player(lesha).
player(dima).
player(anya).
player(misha).
player(sasha).

% all cards

card(2, clubs).
card(3, clubs).
card(4, clubs).
card(5, clubs).
card(6, clubs).
card(7, clubs).
card(8, clubs).
card(9, clubs).
card(10, clubs).
card(jack, clubs).
card(queen, clubs).
card(king, clubs).
card(ace, clubs).

card(2, diamonds).
card(3, diamonds).
card(4, diamonds).
card(5, diamonds).
card(6, diamonds).
card(7, diamonds).
card(8, diamonds).
card(9, diamonds).
card(10, diamonds).
card(jack, diamonds).
card(queen, diamonds).
card(king, diamonds).
card(ace, diamonds).
card(ace, diamonds).

card(2, hearts).
card(3, hearts).
card(4, hearts).
card(5, hearts).
card(6, hearts).
card(7, hearts).
card(8, hearts).
card(9, hearts).
card(10, hearts).
card(jack, hearts).
card(queen, hearts).
card(king, hearts).
card(ace, hearts).

card(2, spades).
card(3, spades).
card(4, spades).
card(5, spades).
card(6, spades).
card(7, spades).
card(8, spades).
card(9, spades).
card(10, spades).
card(jack, spades).
card(queen, spades).
card(king, spades).
card(ace, spades).

% cards on a table

% table([card(3, diamonds), card(3, diamonds), card(7, diamonds), card(8, hearts), card(ace, clubs)]).

% cards in each hand

% hand(dasha, [card(5, spades), card(5, hearts)]).

% :-dynamic(hand/2).
% hand(lesha, [card(6, diamonds), card(9, spades)]).
% hand(dima, [card(jack, hearts), card(king, diamonds)]).
% hand(anya, [card(2, spades), card(queen, hearts)]).
% hand(misha, [card(7, spades), card(9, hearts)]).
% hand(sasha, [card(10, diamonds), card(ace, spades)]).

% all possible combinations

combination(highCard).
combination(pair).
combination(twoPair).
combination(set).
combination(straight).
combination(flush).
combination(fullHouse).
combination(fourOfAKind).
combination(straightFlush).
combination(royalFlush).

% getting the difference between cards

cardValue(ace, 14).
cardValue(king, 13).
cardValue(queen, 12).
cardValue(jack, 11).
cardValue(X, X) :- number(X).

valueDifference(card(X, _), card(Y, _), 1) :-
    cardValue(X, Value1),
    cardValue(Y, Value2),
    abs(Value1 - Value2) =:= 1.

% combination rules 

highCard(CardList) :- \+pair(CardList), \+twoPair(CardList), \+set(CardList).

pair(CardList) :- 
    select(card(X, _), CardList, Rest), member(card(X, _), Rest).

twoPair(CardList) :-
    select(card(X, _), CardList, Rest1),
    select(card(X, _), Rest1, Rest2),
    select(card(Y, _), Rest2, Rest3),
    select(card(Y, _), Rest3, _).

set(CardList) :-
    select(card(X, _), CardList, Rest1),
    select(card(X, _), Rest1, Rest2),
    member(card(X, _), Rest2).

straight(CardList) :-
    length(CardList, N),
    N == 5,
    cardSortAscend(CardList, SortedList),
    consecutiveValues(SortedList).

flush(CardList) :-
    length(CardList, N),
    N == 5,
    allSameSuit(CardList).

fullHouse(CardList) :-
    select(card(X, _), CardList, Rest1),
    select(card(X, _), Rest1, Rest2),
    select(card(X, _), Rest2, Rest),
    pair(Rest).

fourOfAKind(CardList) :-
    select(card(X, _), CardList, Rest1),
    select(card(X, _), Rest1, Rest2),
    select(card(X, _), Rest2, Rest3),
    member(card(X, _), Rest3).

straightFlush(CardList) :- straight(CardList), flush(CardList).

royalFlush(CardList) :-
    flush(CardList),
    cardSortAscend(CardList, SortedList),
    SortedList = [card(10, _)|_],
    length(SortedList, N),
    N == 5,
    consecutiveValues(SortedList).

% helpers

consecutiveValues([_]).
consecutiveValues([Card1, Card2|Rest]) :-
    (valueDifference(Card1, Card2, 1) ; valueDifference(Card2, Card1, 1)),
    consecutiveValues([Card2|Rest]).

allSameSuit([_]).
allSameSuit([card(_, Suit1), card(_, Suit2)|Rest]) :-
    Suit1 = Suit2,
    allSameSuit([card(_, Suit2)|Rest]).

cardSortAscend(In, Out) :-
    predsort(cardCompareAsc, In, Out).

cardCompareAsc(R, card(X, _), card(Y, _)) :-
    cardValue(X, Val1), cardValue(Y, Val2),
    compare(R, Val1, Val2).

