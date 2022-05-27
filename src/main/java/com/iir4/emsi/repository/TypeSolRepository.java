package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.TypeSol;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeSol entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeSolRepository extends JpaRepository<TypeSol, Long> {
	@Query("select ts from TypeSol ts where ts.id in (select z.typesol.id from Zone z where z.id=?1)")
	List<TypeSol> getByZone(Long id);
}
