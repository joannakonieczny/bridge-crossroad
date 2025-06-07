import { NextResponse } from 'next/server';
import { connectDB } from '@/services/dbManagement';
import { RegisterFormValues } from '@/services/auth/actions';

export async function POST(req: Request) {
  try {
    const body: RegisterFormValues = await req.json();
    const { name, surname, email, password } = body;

    if (!email || !password || !name || !surname) {
      return NextResponse.json({ error: 'Brakuje wymaganych pól' }, { status: 400 });
    }

    const db = await connectDB();
    const usersCollection = db.collection('users'); // kolekcja w bazie "v1"

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Użytkownik już istnieje' }, { status: 409 });
    }

    // Zapis nowego użytkownika (hasło w czystym tekście – tylko tymczasowo!)
    const result = await usersCollection.insertOne({
      name,
      surname,
      email,
      password, // NIEzahaszowane!
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Użytkownik zarejestrowany',
      user: {
        id: result.insertedId,
        email,
        name,
        surname,
      },
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}