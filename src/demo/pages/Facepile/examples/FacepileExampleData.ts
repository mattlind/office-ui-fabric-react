import * as React from 'react';
import {
    IFacepilePersona,
    PersonaInitialsColor
} from '../../../../index';

export const facepilePersonas: IFacepilePersona[] = [
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'PV',
        personaName: 'Annie Lindqvist',
        initialsColor: PersonaInitialsColor.blue,
        data: '50%'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AR',
        personaName: 'Aaron Reid',
        initialsColor: PersonaInitialsColor.darkBlue,
        data: '2'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AL',
        personaName: 'Alex Lundberg',
        initialsColor: PersonaInitialsColor.darkGreen,
        data: 'Emp1234',
        onClick: (ev: React.MouseEvent, persona: IFacepilePersona) =>
            alert('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'RK',
        personaName: 'Roko Kolar',
        initialsColor: PersonaInitialsColor.darkRed,
        data: '$1,000'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'CB',
        personaName: 'Christian Bergqvist',
        initialsColor: PersonaInitialsColor.green,
        data: '25%'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Valentina Lovric',
        initialsColor: PersonaInitialsColor.lightBlue,
        data: 'Emp1234',
        onClick: (ev: React.MouseEvent, persona: IFacepilePersona) =>
            alert('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Maor Sharett',
        initialsColor: PersonaInitialsColor.lightGreen,
        data: '75%'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'PV',
        personaName: 'Annie Lindqvist2',
        initialsColor: PersonaInitialsColor.lightPink,
        data: '$1,500'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AR',
        personaName: 'Aaron Reid2',
        initialsColor: PersonaInitialsColor.magenta,
        data: 'Emp1234',
        onClick: (ev: React.MouseEvent, persona: IFacepilePersona) =>
            alert('You clicked on ' + persona.personaName + '. Extra data: ' + persona.data)
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AL',
        personaName: 'Alex Lundberg2',
        initialsColor: PersonaInitialsColor.orange,
        data: '5'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'RK',
        personaName: 'Roko Kolar2',
        initialsColor: PersonaInitialsColor.pink,
        data: '0%'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'CB',
        personaName: 'Christian Bergqvist2',
        initialsColor: PersonaInitialsColor.purple,
        data: '$500'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Valentina Lovric2',
        initialsColor: PersonaInitialsColor.red,
        data: '50%'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Maor Sharett2',
        initialsColor: PersonaInitialsColor.teal,
        data: '5'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Another A Name',
        initialsColor: PersonaInitialsColor.blue,
        data: '$1,900'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Another A Name (So Many A names!)',
        initialsColor: PersonaInitialsColor.darkBlue,
        data: '25%'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Another Anecdotal A Name',
        initialsColor: PersonaInitialsColor.darkGreen,
        data: '90%'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Anerobic A Name',
        initialsColor: PersonaInitialsColor.darkRed,
        data: '$100'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Aerobic A Name',
        initialsColor: PersonaInitialsColor.green,
        data: '3'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Maor Sharett2',
        initialsColor: PersonaInitialsColor.lightBlue,
        data: '50%'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Valentina Lovric2',
        initialsColor: PersonaInitialsColor.lightGreen,
        data: '25%'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Maor Sharett2',
        initialsColor: PersonaInitialsColor.lightPink,
        data: '$1,400'
    },
    {
        imageUrl: './images/persona-female.png',
        imageInitials: 'VL',
        personaName: 'Valentina Lovric2',
        initialsColor: PersonaInitialsColor.magenta,
        data: '8'
    },
    {
        imageUrl: './images/persona-male.png',
        imageInitials: 'MS',
        personaName: 'Maor Sharett2',
        initialsColor: PersonaInitialsColor.orange,
        data: '100%'
    },
];