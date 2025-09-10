import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Updated interfaces to match your MOCK_DATA.json structure
interface PatientContact {
  address: string | null;
  number: string | null;
  email: string | null;
}

interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact: PatientContact[];
  medical_issue: string;
}

interface PaginationResponse {
  data: Patient[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<PaginationResponse | { error: string }>> {
  try {
    // Get the path to the MOCK_DATA.json file
    const filePath = path.join(process.cwd(), 'lib', 'MOCK_DATA.json');
    
    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
      console.error('Mock data file not found:', filePath);
      return NextResponse.json(
        { error: 'Data file not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the JSON data with error handling
    let data: Patient[];
    try {
      data = JSON.parse(fileContents);
      console.log(`Loaded ${data.length} patients from MOCK_DATA.json`);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      );
    }

    // Validate that data is an array
    if (!Array.isArray(data)) {
      console.error('Data is not an array');
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 500 }
      );
    }

    // Get pagination and search parameters from URL search params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const sortBy = searchParams.get('sortBy') || 'patient_name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const medicalIssueFilter = searchParams.get('medicalIssue')?.toLowerCase();

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

    // Apply search filtering if search query is provided
    let filteredData = data;
    if (search) {
      filteredData = data.filter(patient => {
        const contact = patient.contact[0] || {};
        return (
          patient.patient_name.toLowerCase().includes(search) ||
          String(patient.patient_id).toLowerCase().includes(search) ||
          (contact.number && contact.number.includes(search)) ||
          (contact.email && contact.email.toLowerCase().includes(search)) ||
          patient.medical_issue.toLowerCase().includes(search)
        );
      });
    }

    // Apply medical issue filter if provided
    if (medicalIssueFilter) {
      const filterArray = medicalIssueFilter.split(',').map(f => f.trim());
      filteredData = filteredData.filter(patient => 
        filterArray.includes(patient.medical_issue.toLowerCase())
      );
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortBy) {
        case 'patient_name':
          aValue = a.patient_name?.toLowerCase() || '';
          bValue = b.patient_name?.toLowerCase() || '';
          break;
        case 'age':
          aValue = a.age || 0;
          bValue = b.age || 0;
          break;
        case 'patient_id':
          aValue = a.patient_id || 0;
          bValue = b.patient_id || 0;
          break;
        case 'medical_issue':
          aValue = a.medical_issue?.toLowerCase() || '';
          bValue = b.medical_issue?.toLowerCase() || '';
          break;
        default:
          aValue = a.patient_name?.toLowerCase() || '';
          bValue = b.patient_name?.toLowerCase() || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    // Calculate pagination
    const startIndex = (validPage - 1) * validLimit;
    const endIndex = startIndex + validLimit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPrevPage = validPage > 1;

    // Return the paginated data with metadata
    return NextResponse.json({
      data: paginatedData,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: validLimit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? validPage + 1 : null,
        prevPage: hasPrevPage ? validPage - 1 : null
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error in API route:', error);
    
    // More specific error handling
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 500 }
      );
    }
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return NextResponse.json(
        { error: 'Data file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}